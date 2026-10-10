import { prisma } from "../lib/prisma.js";

import {
  createBookingSchema,
} from "../validators/booking.validator.js";

/*
|--------------------------------------------------------------------------
| CREATE BOOKING
|--------------------------------------------------------------------------
*/

export const createBooking = async (
  req,
  res
) => {
  try {
    const validationResult =
      createBookingSchema.safeParse(
        req.body
      );

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid booking details",
        errors:
          validationResult.error
            .flatten()
            .fieldErrors,
      });
    }

    const {
      vehicleId,
      serviceId,
      slotId,
    } = validationResult.data;

    /*
    |--------------------------------------------------------------------------
    | CHECK VEHICLE
    |--------------------------------------------------------------------------
    */

    const vehicle =
      await prisma.vehicle.findFirst({
        where: {
          id: vehicleId,
          userId: req.user.id,
        },
      });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message:
          "Vehicle not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | CHECK SERVICE
    |--------------------------------------------------------------------------
    */

    const service =
      await prisma.service.findFirst({
        where: {
          id: serviceId,
          isActive: true,
        },

        include: {
          prices: {
            where: {
              vehicleType:
                vehicle.vehicleType,
            },
          },
        },
      });

    if (!service) {
      return res.status(404).json({
        success: false,
        message:
          "Service is not available",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | GET CORRECT PRICE
    |--------------------------------------------------------------------------
    */

    const servicePrice =
      service.prices[0];

    if (!servicePrice) {
      return res.status(400).json({
        success: false,
        message:
          "Price is not available for this vehicle type",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | CHECK SLOT
    |--------------------------------------------------------------------------
    */

    const slot =
      await prisma.slot.findUnique({
        where: {
          id: slotId,
        },
      });

    if (!slot) {
      return res.status(404).json({
        success: false,
        message:
          "Slot not found",
      });
    }

    if (!slot.isOpen) {
      return res.status(409).json({
        success: false,
        message:
          "This slot is no longer available",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE BOOKING IN TRANSACTION
    |--------------------------------------------------------------------------
    |
    | This prevents two users from successfully
    | taking the same slot.
    |
    */

    const booking =
      await prisma.$transaction(
        async (tx) => {
          /*
           * Atomically close the slot only
           * if it is still open.
           */

          const slotUpdate =
            await tx.slot.updateMany({
              where: {
                id: slotId,
                isOpen: true,
              },

              data: {
                isOpen: false,
              },
            });

          /*
           * count = 0 means somebody else
           * already took or closed it.
           */

          if (
            slotUpdate.count !== 1
          ) {
            throw new Error(
              "SLOT_NOT_AVAILABLE"
            );
          }

          /*
           * Create the booking.
           *
           * Price comes from the backend,
           * NOT from the frontend.
           */

          return await tx.booking.create({
            data: {
              userId:
                req.user.id,

              vehicleId,

              serviceId,

              slotId,

              pricePaise:
                servicePrice.pricePaise,

              status:
                "PENDING",

              paymentStatus:
                "UNPAID",
            },

            include: {
              vehicle: true,
              service: true,
              slot: true,
            },
          });
        }
      );

    return res.status(201).json({
      success: true,
      message:
        "Booking created successfully",

      booking: {
        ...booking,

        priceRupees:
          booking.pricePaise /
          100,
      },
    });
  } catch (error) {
    /*
    |--------------------------------------------------------------------------
    | SLOT ALREADY TAKEN
    |--------------------------------------------------------------------------
    */

    if (
      error.message ===
      "SLOT_NOT_AVAILABLE"
    ) {
      return res.status(409).json({
        success: false,
        message:
          "This slot was just booked by another user. Please choose another slot.",
      });
    }

    /*
     * slotId also has @unique in Prisma.
     * This is an extra database-level
     * protection against double booking.
     */

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message:
          "This slot has already been booked",
      });
    }

    console.error(
      "Create booking error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create booking",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET MY BOOKINGS
|--------------------------------------------------------------------------
*/

export const getMyBookings =
  async (req, res) => {
    try {
      const bookings =
        await prisma.booking.findMany({
          where: {
            userId: req.user.id,
          },

          include: {
  vehicle: true,
  service: true,
  slot: true,
  worker: true,
},

          orderBy: {
            createdAt: "desc",
          },
        });

      const formattedBookings =
        bookings.map(
          (booking) => ({
            ...booking,

            priceRupees:
              booking.pricePaise /
              100,
          })
        );

      return res.status(200).json({
        success: true,
        bookings:
          formattedBookings,
      });
    } catch (error) {
      console.error(
        "Get bookings error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load bookings",
      });
    }
  };

  /*
|--------------------------------------------------------------------------
| MOCK PAYMENT
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| MOCK PAYMENT
|--------------------------------------------------------------------------
*/

export const payBooking = async (req, res) => {
  try {
    const bookingId = Number(req.params.id);

    console.log(
      "Mock payment request:",
      {
        bookingId,
        userId: req.user.id,
      }
    );

    if (!Number.isInteger(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | FIND THIS USER'S BOOKING
    |--------------------------------------------------------------------------
    */

    const booking =
      await prisma.booking.findFirst({
        where: {
          id: bookingId,
          userId: req.user.id,
        },
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | DO NOT PAY CANCELLED BOOKING
    |--------------------------------------------------------------------------
    */

    if (
      booking.status === "CANCELLED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cancelled booking cannot be paid",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | ALREADY PAID
    |--------------------------------------------------------------------------
    */

    if (
      booking.paymentStatus ===
      "PAID"
    ) {
      return res.status(200).json({
        success: true,
        message:
          "Payment already completed",
        booking,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | MARK PAYMENT AS PAID
    |--------------------------------------------------------------------------
    */

    const updatedBooking =
      await prisma.booking.update({
        where: {
          id: bookingId,
        },

        data: {
          paymentStatus: "PAID",
        },

        include: {
          vehicle: true,
          service: true,
          slot: true,
          worker: true,
        },
      });

    console.log(
      "Payment updated:",
      updatedBooking.paymentStatus
    );

    return res.status(200).json({
      success: true,

      message:
        "Payment completed successfully",

      booking: {
        ...updatedBooking,

        priceRupees:
          updatedBooking.pricePaise /
          100,
      },
    });
  } catch (error) {
    console.error(
      "Mock payment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to complete payment",
    });
  }
};