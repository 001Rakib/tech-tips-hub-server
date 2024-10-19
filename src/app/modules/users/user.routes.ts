import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { userValidationSchema } from "./user.validation";
import { userControllers } from "./user.controllers";
import { authValidation } from "../auth/auth.validation";
import auth from "../../middleware/auth";

const router = Router();

router.post(
  "/signup",
  validateRequest(userValidationSchema.signUpUserValidationSchema),
  userControllers.signUpUser
);
router.post("/login", userControllers.signInUser);
router.patch(
  "/user/change-password",
  auth("admin", "user"),
  userControllers.changePassword
);
router.get("/user", auth("user", "admin"), userControllers.getAllUser);
router.get("/user/:id", userControllers.getUser);
router.patch("/user/:id", auth("user", "admin"), userControllers.updateUser);
router.delete("/user/:id", auth("user", "admin"), userControllers.deleteUser);
router.patch(
  "/user/status/:id",
  auth("admin"),
  userControllers.updateUserStatus
);

router.post(
  "/refresh-token",
  validateRequest(authValidation.refreshTokenValidationSchema),
  userControllers.refreshToken
);

export const UserRoutes = router;
