import { prisma } from "../lib/prisma.js";

const services = [
  {
    name: "Basic Wash",
    description:
      "Exterior body wash, rinse, and drying for regular maintenance.",
    prices: {
      HATCHBACK: 299,
      SEDAN: 349,
      SUV: 449,
      MUV: 499,
      LUXURY: 649,
    },
  },

  {
    name: "Foam Wash",
    description:
      "Thick foam cleaning that removes dirt and road grime safely.",
    prices: {
      HATCHBACK: 399,
      SEDAN: 449,
      SUV: 549,
      MUV: 599,
      LUXURY: 749,
    },
  },

  {
    name: "Premium Wash",
    description:
      "Complete interior and exterior cleaning for a fresh, polished, and premium finish.",
    prices: {
      HATCHBACK: 499,
      SEDAN: 599,
      SUV: 749,
      MUV: 799,
      LUXURY: 999,
    },
  },

  {
    name: "Interior Deep Cleaning",
    description:
      "Vacuuming, dashboard cleaning, seat cleaning, mats, and complete interior detailing.",
    prices: {
      HATCHBACK: 699,
      SEDAN: 799,
      SUV: 999,
      MUV: 1099,
      LUXURY: 1299,
    },
  },

  {
    name: "Wax & Polish",
    description:
      "Exterior polishing and protective wax for extra shine and paint protection.",
    prices: {
      HATCHBACK: 799,
      SEDAN: 899,
      SUV: 1099,
      MUV: 1199,
      LUXURY: 1499,
    },
  },

  {
    name: "Full Car Detailing",
    description:
      "Complete premium detailing including exterior, interior, wheels, polishing, and finishing.",
    prices: {
      HATCHBACK: 1499,
      SEDAN: 1699,
      SUV: 1999,
      MUV: 2199,
      LUXURY: 2699,
    },
  },
];

async function seedServices() {
  try {
    for (const serviceData of services) {
      const service = await prisma.service.upsert({
        where: {
          name: serviceData.name,
        },

        update: {
          description:
            serviceData.description,
          isActive: true,
        },

        create: {
          name: serviceData.name,
          description:
            serviceData.description,
          isActive: true,
        },
      });

      for (const [
        vehicleType,
        price,
      ] of Object.entries(
        serviceData.prices
      )) {
        await prisma.servicePrice.upsert({
          where: {
            serviceId_vehicleType: {
              serviceId: service.id,
              vehicleType,
            },
          },

          update: {
            pricePaise:
              price * 100,
          },

          create: {
            serviceId: service.id,
            vehicleType,
            pricePaise:
              price * 100,
          },
        });
      }

      console.log(
        `Added/updated: ${serviceData.name}`
      );
    }

    console.log(
      "All car wash services added successfully."
    );
  } catch (error) {
    console.error(
      "Service seed error:",
      error
    );
  } finally {
    await prisma.$disconnect();
  }
}

seedServices();