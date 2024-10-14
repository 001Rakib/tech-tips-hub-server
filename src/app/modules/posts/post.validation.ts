import { z } from "zod";

const createPostValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, { message: "Name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    category: z.string(),
    author: z.string(),
    authorImage: z.string(),
    status: z.string(),
  }),
});
const updatePostValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, { message: "Name is required" }).optional(),
    description: z
      .string()
      .min(1, { message: "Description is required" })
      .optional(),
  }),
});
export const postValidationSchema = {
  createPostValidationSchema,
  updatePostValidationSchema,
};
