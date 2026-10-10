import { z } from "zod";

export const createSlotSchema = z.object({
  date: z
    .string()
    .trim()
    .min(1, "Date is required"),

  startTime: z
    .string()
    .trim()
    .min(1, "Start time is required"),

  endTime: z
    .string()
    .trim()
    .min(1, "End time is required"),
});