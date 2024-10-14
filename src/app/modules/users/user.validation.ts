import { z } from "zod";

const signUpUserValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});
export const userValidationSchema = {
  signUpUserValidationSchema,
};
