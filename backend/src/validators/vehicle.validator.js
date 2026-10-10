import { z } from "zod";

export const createVehicleSchema = z.object({
  carName: z
    .string()
    .trim()
    .min(2, "Car name is required")
    .max(80, "Car name is too long"),

  carNumber: z
    .string()
    .trim()
    .min(4, "Car number is required")
    .max(20, "Car number is too long"),

  vehicleType: z.enum([
    "HATCHBACK",
    "SEDAN",
    "SUV",
    "MUV",
    "LUXURY",
  ]),
});