import { z } from "zod";

export const createBookingSchema =
  z.object({
    vehicleId: z.coerce
      .number()
      .int()
      .positive(
        "Please select a vehicle"
      ),

    serviceId: z.coerce
      .number()
      .int()
      .positive(
        "Please select a service"
      ),

    slotId: z.coerce
      .number()
      .int()
      .positive(
        "Please select a slot"
      ),
  });