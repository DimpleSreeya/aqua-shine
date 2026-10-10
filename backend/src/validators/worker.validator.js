import { z } from "zod";

export const createWorkerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Worker name is required")
    .max(80, "Worker name is too long"),

  phone: z
    .string()
    .trim()
    .regex(
      /^\+?[1-9]\d{7,14}$/,
      "Please enter a valid phone number"
    ),
});