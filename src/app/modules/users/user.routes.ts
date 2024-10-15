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
router.get("/user/:email", userControllers.getUser);
router.get("/user", userControllers.getAllUser);
router.patch("/user/:id", auth("user", "admin"), userControllers.updateUser);
router.post(
  "/refresh-token",
  validateRequest(authValidation.refreshTokenValidationSchema),
  userControllers.refreshToken
);

export const UserRoutes = router;
