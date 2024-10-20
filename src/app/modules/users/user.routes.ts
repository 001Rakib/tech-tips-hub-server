import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { userValidationSchema } from "./user.validation";
import { userControllers } from "./user.controllers";
import { authValidation } from "../auth/auth.validation";

const router = Router();

router.post(
  "/signup",
  validateRequest(userValidationSchema.signUpUserValidationSchema),
  userControllers.signUpUser
);
router.post("/login", userControllers.signInUser);
router.patch(
  "/user/change-password",

  userControllers.changePassword
);
router.get("/user", userControllers.getAllUser);
router.get("/user/:id", userControllers.getUser);
router.patch("/user/:id", userControllers.updateUser);
router.delete("/user/:id", userControllers.deleteUser);
router.patch(
  "/user/status/:id",

  userControllers.updateUserStatus
);

router.post(
  "/refresh-token",
  validateRequest(authValidation.refreshTokenValidationSchema),
  userControllers.refreshToken
);

export const UserRoutes = router;
