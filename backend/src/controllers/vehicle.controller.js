import { prisma } from "../lib/prisma.js";

import {
  createVehicleSchema,
} from "../validators/vehicle.validator.js";

/*
|--------------------------------------------------------------------------
| ADD VEHICLE
|--------------------------------------------------------------------------
*/

export const createVehicle = async (
  req,
  res
) => {
  try {
    const validationResult =
      createVehicleSchema.safeParse(
        req.body
      );

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid vehicle details",
        errors:
          validationResult.error
            .flatten()
            .fieldErrors,
      });
    }

    const {
      carName,
      carNumber,
      vehicleType,
    } = validationResult.data;

    /*
     * Normalize car number.
     *
     * Example:
     * ap 26 ab 1234
     * becomes
     * AP26AB1234
     */

    const normalizedCarNumber =
      carNumber
        .toUpperCase()
        .replace(/[\s-]/g, "");

    /*
    |--------------------------------------------------------------------------
    | CHECK DUPLICATE CAR NUMBER
    |--------------------------------------------------------------------------
    */

    const existingVehicle =
      await prisma.vehicle.findUnique({
        where: {
          carNumber:
            normalizedCarNumber,
        },
      });

    if (existingVehicle) {
      return res.status(409).json({
        success: false,
        message:
          "This car number is already registered",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE VEHICLE FOR CURRENT USER
    |--------------------------------------------------------------------------
    */

    const vehicle =
      await prisma.vehicle.create({
        data: {
          userId: req.user.id,

          carName,

          carNumber:
            normalizedCarNumber,

          vehicleType,
        },
      });

    return res.status(201).json({
      success: true,
      message:
        "Vehicle added successfully",
      vehicle,
    });
  } catch (error) {
    console.error(
      "Create vehicle error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to add vehicle",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET CURRENT USER'S VEHICLES
|--------------------------------------------------------------------------
*/

export const getMyVehicles = async (
  req,
  res
) => {
  try {
    const vehicles =
      await prisma.vehicle.findMany({
        where: {
          userId: req.user.id,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return res.status(200).json({
      success: true,
      vehicles,
    });
  } catch (error) {
    console.error(
      "Get vehicles error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load vehicles",
    });
  }
};