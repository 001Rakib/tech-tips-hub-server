import { z } from "zod";

const createBookingValidationSchema = z.object({
  body: z.object({
    carId: z.string(),
    drivingLicense: z.string(),
    nid: z.string(),
    date: z.string(),
    startTime: z.string(),
    payment: z.enum(["pending", "paid"]).optional(),
  }),
});
export const bookingValidationSchema = {
  createBookingValidationSchema,
};
