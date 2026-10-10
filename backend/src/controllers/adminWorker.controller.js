import { prisma } from "../lib/prisma.js";

import {
  createWorkerSchema,
} from "../validators/worker.validator.js";

/*
|--------------------------------------------------------------------------
| CREATE WORKER
|--------------------------------------------------------------------------
*/

export const createWorker = async (
  req,
  res
) => {
  try {
    const validationResult =
      createWorkerSchema.safeParse(
        req.body
      );

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid worker details",
        errors:
          validationResult.error
            .flatten()
            .fieldErrors,
      });
    }

    const {
      name,
      phone,
    } = validationResult.data;

    const existingWorker =
      await prisma.worker.findUnique({
        where: {
          phone,
        },
      });

    if (existingWorker) {
      return res.status(409).json({
        success: false,
        message:
          "A worker with this phone number already exists",
      });
    }

    const worker =
      await prisma.worker.create({
        data: {
          name,
          phone,
          isActive: true,
        },
      });

    return res.status(201).json({
      success: true,
      message:
        "Worker created successfully",
      worker,
    });
  } catch (error) {
    console.error(
      "Create worker error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create worker",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET ALL WORKERS
|--------------------------------------------------------------------------
*/

export const getWorkers = async (
  req,
  res
) => {
  try {
    const workers =
      await prisma.worker.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return res.status(200).json({
      success: true,
      workers,
    });
  } catch (error) {
    console.error(
      "Get workers error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load workers",
    });
  }
};

/*
|--------------------------------------------------------------------------
| ACTIVATE / DEACTIVATE WORKER
|--------------------------------------------------------------------------
*/

export const updateWorkerStatus =
  async (req, res) => {
    try {
      const workerId =
        Number(req.params.id);

      if (
        !Number.isInteger(workerId)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid worker ID",
        });
      }

      const {
        isActive,
      } = req.body;

      if (
        typeof isActive !==
        "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "isActive must be true or false",
        });
      }

      const existingWorker =
        await prisma.worker.findUnique({
          where: {
            id: workerId,
          },
        });

      if (!existingWorker) {
        return res.status(404).json({
          success: false,
          message:
            "Worker not found",
        });
      }

      const worker =
        await prisma.worker.update({
          where: {
            id: workerId,
          },

          data: {
            isActive,
          },
        });

      return res.status(200).json({
        success: true,

        message: isActive
          ? "Worker activated successfully"
          : "Worker deactivated successfully",

        worker,
      });
    } catch (error) {
      console.error(
        "Update worker error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update worker",
      });
    }
  };