import { prisma } from "../lib/prisma.js";

import {
  createSlotSchema,
} from "../validators/slot.validator.js";

/*
|--------------------------------------------------------------------------
| CREATE SLOT - ADMIN ONLY
|--------------------------------------------------------------------------
*/

export const createSlot = async (
  req,
  res
) => {
  try {
    const validationResult =
      createSlotSchema.safeParse(
        req.body
      );

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid slot details",
        errors:
          validationResult.error
            .flatten()
            .fieldErrors,
      });
    }

    const {
      date,
      startTime,
      endTime,
    } = validationResult.data;

    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message:
          "End time must be after start time",
      });
    }

    const existingSlot =
      await prisma.slot.findUnique({
        where: {
          date_startTime: {
            date,
            startTime,
          },
        },
      });

    if (existingSlot) {
      return res.status(409).json({
        success: false,
        message:
          "A slot already exists for this date and start time",
      });
    }

    const slot =
      await prisma.slot.create({
        data: {
          date,
          startTime,
          endTime,
          isOpen: true,
        },
      });

    return res.status(201).json({
      success: true,
      message:
        "Slot created successfully",
      slot,
    });
  } catch (error) {
    console.error(
      "Create slot error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create slot",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET ALL SLOTS
|--------------------------------------------------------------------------
*/

export const getSlots = async (
  req,
  res
) => {
  try {
    const slots =
      await prisma.slot.findMany({
        orderBy: [
          {
            date: "asc",
          },
          {
            startTime: "asc",
          },
        ],
      });

    return res.status(200).json({
      success: true,
      slots,
    });
  } catch (error) {
    console.error(
      "Get slots error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load slots",
    });
  }
};

/*
|--------------------------------------------------------------------------
| OPEN OR CLOSE SLOT
|--------------------------------------------------------------------------
*/

export const updateSlotStatus = async (
  req,
  res
) => {
  try {
    const slotId =
      Number(req.params.id);

    if (!Number.isInteger(slotId)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid slot ID",
      });
    }

    const {
      isOpen,
    } = req.body;

    if (
      typeof isOpen !==
      "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "isOpen must be true or false",
      });
    }

    const existingSlot =
      await prisma.slot.findUnique({
        where: {
          id: slotId,
        },
      });

    if (!existingSlot) {
      return res.status(404).json({
        success: false,
        message:
          "Slot not found",
      });
    }

    const slot =
      await prisma.slot.update({
        where: {
          id: slotId,
        },

        data: {
          isOpen,
        },
      });

    return res.status(200).json({
      success: true,
      message: isOpen
        ? "Slot opened successfully"
        : "Slot closed successfully",
      slot,
    });
  } catch (error) {
    console.error(
      "Update slot error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update slot",
    });
  }
};