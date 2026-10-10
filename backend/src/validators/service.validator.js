import { z } from "zod";

const priceSchema = z.coerce
  .number()
  .positive("Price must be greater than 0")
  .max(100000, "Price is too high");

export const createServiceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Service name is required")
    .max(100, "Service name is too long"),

  description: z
    .string()
    .trim()
    .max(500, "Description is too long")
    .optional(),

  prices: z.object({
    HATCHBACK: priceSchema,
    SEDAN: priceSchema,
    SUV: priceSchema,
    MUV: priceSchema,
    LUXURY: priceSchema,
  }),
});