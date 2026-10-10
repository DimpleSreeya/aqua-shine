import { prisma } from "../lib/prisma.js";

import {
  createServiceSchema,
} from "../validators/service.validator.js";

/*
|--------------------------------------------------------------------------
| CREATE SERVICE - ADMIN ONLY
|--------------------------------------------------------------------------
*/

export const createService = async (
  req,
  res
) => {
  try {
    const validationResult =
      createServiceSchema.safeParse(
        req.body
      );

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid service details",
        errors:
          validationResult.error
            .flatten()
            .fieldErrors,
      });
    }

    const {
      name,
      description,
      prices,
    } = validationResult.data;

    /*
    |--------------------------------------------------------------------------
    | Prevent duplicate service names
    |--------------------------------------------------------------------------
    */

    const existingService =
      await prisma.service.findUnique({
        where: {
          name,
        },
      });

    if (existingService) {
      return res.status(409).json({
        success: false,
        message:
          "A service with this name already exists",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Convert rupees to paise
    |--------------------------------------------------------------------------
    */

    const priceData =
      Object.entries(prices).map(
        ([vehicleType, price]) => ({
          vehicleType,

          pricePaise:
            Math.round(
              price * 100
            ),
        })
      );

    /*
    |--------------------------------------------------------------------------
    | Create service and all vehicle prices
    |--------------------------------------------------------------------------
    */

    const service =
      await prisma.service.create({
        data: {
          name,
          description:
            description || null,

          isActive: true,

          prices: {
            create: priceData,
          },
        },

        include: {
          prices: true,
        },
      });

    return res.status(201).json({
      success: true,
      message:
        "Service created successfully",
      service,
    });
  } catch (error) {
    console.error(
      "Create service error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create service",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET SERVICES
|--------------------------------------------------------------------------
*/

export const getServices = async (
  req,
  res
) => {
  try {
    const services =
      await prisma.service.findMany({
        include: {
          prices: {
            orderBy: {
              vehicleType: "asc",
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    /*
     * Convert paise back to rupees
     * before sending to frontend.
     */

    const formattedServices =
      services.map((service) => ({
        ...service,

        prices:
          service.prices.map(
            (price) => ({
              ...price,

              priceRupees:
                price.pricePaise /
                100,
            })
          ),
      }));

    return res.status(200).json({
      success: true,
      services:
        formattedServices,
    });
  } catch (error) {
    console.error(
      "Get services error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load services",
    });
  }
};
/*
|--------------------------------------------------------------------------
| UPDATE SERVICE - ADMIN ONLY
|--------------------------------------------------------------------------
*/

export const updateService = async (
  req,
  res
) => {
  try {
    const serviceId =
      Number(req.params.id);

    if (!Number.isInteger(serviceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const validationResult =
      createServiceSchema.safeParse(
        req.body
      );

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid service details",
        errors:
          validationResult.error
            .flatten()
            .fieldErrors,
      });
    }

    const {
      name,
      description,
      prices,
    } = validationResult.data;

    /*
    |--------------------------------------------------------------------------
    | CHECK SERVICE EXISTS
    |--------------------------------------------------------------------------
    */

    const existingService =
      await prisma.service.findUnique({
        where: {
          id: serviceId,
        },
      });

    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | CHECK DUPLICATE NAME
    |--------------------------------------------------------------------------
    */

    const duplicateService =
      await prisma.service.findFirst({
        where: {
          name,

          NOT: {
            id: serviceId,
          },
        },
      });

    if (duplicateService) {
      return res.status(409).json({
        success: false,
        message:
          "Another service already uses this name",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE SERVICE + PRICES
    |--------------------------------------------------------------------------
    */

    await prisma.$transaction(
      async (tx) => {
        await tx.service.update({
          where: {
            id: serviceId,
          },

          data: {
            name,

            description:
              description || null,
          },
        });

        for (
          const [
            vehicleType,
            price,
          ] of Object.entries(prices)
        ) {
          await tx.servicePrice.upsert({
            where: {
              serviceId_vehicleType: {
                serviceId,
                vehicleType,
              },
            },

            update: {
              pricePaise:
                Math.round(
                  price * 100
                ),
            },

            create: {
              serviceId,
              vehicleType,

              pricePaise:
                Math.round(
                  price * 100
                ),
            },
          });
        }
      }
    );

    const service =
      await prisma.service.findUnique({
        where: {
          id: serviceId,
        },

        include: {
          prices: true,
        },
      });

    return res.status(200).json({
      success: true,
      message:
        "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error(
      "Update service error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update service",
    });
  }
};

/*
|--------------------------------------------------------------------------
| ACTIVATE / DEACTIVATE SERVICE
|--------------------------------------------------------------------------
*/

export const updateServiceStatus =
  async (req, res) => {
    try {
      const serviceId =
        Number(req.params.id);

      if (
        !Number.isInteger(
          serviceId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid service ID",
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

      const existingService =
        await prisma.service.findUnique({
          where: {
            id: serviceId,
          },
        });

      if (!existingService) {
        return res.status(404).json({
          success: false,
          message:
            "Service not found",
        });
      }

      const service =
        await prisma.service.update({
          where: {
            id: serviceId,
          },

          data: {
            isActive,
          },
        });

      return res.status(200).json({
        success: true,

        message: isActive
          ? "Service activated successfully"
          : "Service deactivated successfully",

        service,
      });
    } catch (error) {
      console.error(
        "Update service status error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update service status",
      });
    }
  };