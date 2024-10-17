import { Router } from "express";
import { followControllers } from "./follow.controller";

const router = Router();

// router.post(
//   "/",
//   auth("user", "admin"),
//   validateRequest(bookingValidationSchema.createBookingValidationSchema),
//   followControllers.createBooking
// );

router.get("/", followControllers.userToFollow);
router.patch("/", followControllers.followUser);

export const followRoutes = router;
