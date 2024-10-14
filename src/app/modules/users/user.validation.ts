import { z } from "zod";

const signUpUserValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    username: z
      .string()
      .min(5, "Username must be at least 5 characters long") // Minimum of 5 characters
      .max(15, "Username must be at most 15 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    password2: z.string(),
  }),
});
export const userValidationSchema = {
  signUpUserValidationSchema,
};
