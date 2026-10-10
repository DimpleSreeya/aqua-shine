import bcrypt from "bcrypt";

import { prisma } from "../lib/prisma.js";

import {
  adminCreateUserSchema,
  resetUserPasswordSchema,
} from "../validators/adminUser.validator.js";

/*
|--------------------------------------------------------------------------
| GET ALL USERS - ADMIN ONLY
|--------------------------------------------------------------------------
*/

export const getAllUsers = async (
  req,
  res
) => {
  try {
    const users =
      await prisma.user.findMany({
        where: {
          role: "USER",
        },

        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          location: true,
          isActive: true,
          createdAt: true,

          vehicles: {
            select: {
              id: true,
              carName: true,
              carNumber: true,
              vehicleType: true,
            },
          },

          bookings: {
            include: {
              vehicle: true,
              service: true,
              slot: true,
            },

            orderBy: {
              createdAt: "desc",
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    /*
    |--------------------------------------------------------------------------
    | CALCULATE TOTAL PAID AMOUNT
    |--------------------------------------------------------------------------
    */

    const formattedUsers =
      users.map((user) => {
        const totalSpentPaise =
          user.bookings
            .filter(
              (booking) =>
                booking.paymentStatus ===
                "PAID"
            )
            .reduce(
              (total, booking) =>
                total +
                booking.pricePaise,
              0
            );

        const bookings =
          user.bookings.map(
            (booking) => ({
              ...booking,

              priceRupees:
                booking.pricePaise /
                100,
            })
          );

        return {
          ...user,

          bookings,

          totalSpentRupees:
            totalSpentPaise / 100,
        };
      });

    return res.status(200).json({
      success: true,
      users: formattedUsers,
    });
  } catch (error) {
    console.error(
      "Get admin users error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load users",
    });
  }
};

/*
|--------------------------------------------------------------------------
| ACTIVATE / DEACTIVATE USER
|--------------------------------------------------------------------------
*/

export const updateUserStatus = async (
  req,
  res
) => {
  try {
    const userId =
      Number(req.params.id);

    if (!Number.isInteger(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const { isActive } = req.body;

    if (
      typeof isActive !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "isActive must be true or false",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | ONLY NORMAL USERS CAN BE MANAGED HERE
    |--------------------------------------------------------------------------
    */

    const existingUser =
      await prisma.user.findFirst({
        where: {
          id: userId,
          role: "USER",
        },
      });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user =
      await prisma.user.update({
        where: {
          id: userId,
        },

        data: {
          isActive,
        },

        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          location: true,
          isActive: true,
        },
      });

    return res.status(200).json({
      success: true,

      message: isActive
        ? "User activated successfully"
        : "User deactivated successfully",

      user,
    });
  } catch (error) {
    console.error(
      "Update user status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update user",
    });
  }
};