import { z } from "zod";

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string(),
  }),
});
export const authValidation = {
  refreshTokenValidationSchema,
};
