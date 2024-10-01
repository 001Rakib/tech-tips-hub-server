import { z } from "zod";

const createCarValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    color: z.string().min(1, { message: "Color is required" }),
    category: z.string(),
    features: z
      .array(z.string())
      .nonempty({ message: "Features are required" }),
    pricePerHour: z
      .number()
      .positive({ message: "Price per hour must be a positive number" }),
  }),
});
const updateCarValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }).optional(),
    description: z
      .string()
      .min(1, { message: "Description is required" })
      .optional(),
    color: z.string().min(1, { message: "Color is required" }).optional(),
    features: z
      .array(z.string())
      .nonempty({ message: "Features are required" })
      .optional(),
    pricePerHour: z
      .number()
      .positive({ message: "Price per hour must be a positive number" })
      .optional(),
  }),
});
export const carValidationSchema = {
  createCarValidationSchema,
  updateCarValidationSchema,
};
