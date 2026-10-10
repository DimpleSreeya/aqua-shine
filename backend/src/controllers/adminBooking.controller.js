import { prisma } from "../lib/prisma.js";

/*
|--------------------------------------------------------------------------
| GET ALL BOOKINGS - ADMIN
|--------------------------------------------------------------------------
*/

export const getAllBookings = async (
  req,
  res
) => {
  try {
    const bookings =
      await prisma.booking.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              location: true,
              isActive: true,
            },
          },

          vehicle: true,

          service: true,

          slot: true,
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
      "Get admin bookings error:",
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
| UPDATE BOOKING STATUS - ADMIN
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| UPDATE BOOKING STATUS - ADMIN
|--------------------------------------------------------------------------
*/

export const updateBookingStatus =
  async (req, res) => {
    try {
      const bookingId =
        Number(req.params.id);

      if (!Number.isInteger(bookingId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking ID",
        });
      }

      const { status } = req.body;

      const allowedStatuses = [
        "PENDING",
        "CONFIRMED",
        "COMPLETED",
        "CANCELLED",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid booking status",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | FIND BOOKING
      |--------------------------------------------------------------------------
      */

      const existingBooking =
        await prisma.booking.findUnique({
          where: {
            id: bookingId,
          },
        });

      if (!existingBooking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | COMPLETED AND CANCELLED ARE FINAL
      |--------------------------------------------------------------------------
      */

      if (
        existingBooking.status ===
        "COMPLETED"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Completed bookings cannot be changed",
        });
      }

      if (
        existingBooking.status ===
        "CANCELLED"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Cancelled bookings cannot be changed",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | VALID STATUS FLOW
      |--------------------------------------------------------------------------
      */

      const validTransitions = {
        PENDING: [
          "CONFIRMED",
          "CANCELLED",
        ],

        CONFIRMED: [
          "COMPLETED",
          "CANCELLED",
        ],
      };

      const allowedNextStatuses =
        validTransitions[
          existingBooking.status
        ] || [];

      if (
        status !==
          existingBooking.status &&
        !allowedNextStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Cannot change booking from ${existingBooking.status} to ${status}`,
        });
      }

      /*
      |--------------------------------------------------------------------------
      | CANCEL BOOKING + REOPEN SLOT
      |--------------------------------------------------------------------------
      */

      if (status === "CANCELLED") {
        await prisma.$transaction(
          async (tx) => {
            await tx.booking.update({
              where: {
                id: bookingId,
              },

              data: {
                status: "CANCELLED",

                // Remove assigned worker
                workerId: null,
              },
            });

            /*
             * Reopen the slot so another
             * customer can book it.
             */

            await tx.slot.update({
              where: {
                id:
                  existingBooking.slotId,
              },

              data: {
                isOpen: true,
              },
            });
          }
        );
      } else {
        /*
        |--------------------------------------------------------------------------
        | NORMAL STATUS UPDATE
        |--------------------------------------------------------------------------
        */

        await prisma.booking.update({
          where: {
            id: bookingId,
          },

          data: {
            status,
          },
        });
      }

      /*
      |--------------------------------------------------------------------------
      | RETURN UPDATED BOOKING
      |--------------------------------------------------------------------------
      */

      const booking =
        await prisma.booking.findUnique({
          where: {
            id: bookingId,
          },

          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                location: true,
              },
            },

            vehicle: true,
            service: true,
            slot: true,
            worker: true,
          },
        });

      return res.status(200).json({
        success: true,

        message:
          status === "CANCELLED"
            ? "Booking cancelled and slot reopened successfully"
            : "Booking status updated successfully",

        booking: {
          ...booking,

          priceRupees:
            booking.pricePaise / 100,
        },
      });
    } catch (error) {
      console.error(
        "Update booking status error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update booking status",
      });
    }
  };
  /*
|--------------------------------------------------------------------------
| ASSIGN WORKER TO BOOKING
|--------------------------------------------------------------------------
*/

export const assignWorker =
  async (req, res) => {
    try {
      const bookingId =
        Number(req.params.id);

      const workerId =
        Number(req.body.workerId);

      if (
        !Number.isInteger(bookingId) ||
        !Number.isInteger(workerId)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid booking or worker ID",
        });
      }

      const booking =
        await prisma.booking.findUnique({
          where: {
            id: bookingId,
          },
        });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message:
            "Booking not found",
        });
      }

      if (
        booking.status ===
          "CANCELLED" ||
        booking.status ===
          "COMPLETED"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Worker cannot be assigned to this booking",
        });
      }

      const worker =
        await prisma.worker.findFirst({
          where: {
            id: workerId,
            isActive: true,
          },
        });

      if (!worker) {
        return res.status(404).json({
          success: false,
          message:
            "Active worker not found",
        });
      }

      const updatedBooking =
        await prisma.booking.update({
          where: {
            id: bookingId,
          },

          data: {
            workerId,
          },

          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                location: true,
              },
            },

            vehicle: true,
            service: true,
            slot: true,
            worker: true,
            
          },
        });

      return res.status(200).json({
        success: true,
        message:
          "Worker assigned successfully",

        booking: {
          ...updatedBooking,

          priceRupees:
            updatedBooking.pricePaise /
            100,
        },
      });
    } catch (error) {
      console.error(
        "Assign worker error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to assign worker",
      });
    }
  };
  