import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { bookingValidationSchema } from "./booking.validation";
import { followControllers } from "./follow.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post(
  "/",
  auth("user", "admin"),
  validateRequest(bookingValidationSchema.createBookingValidationSchema),
  followControllers.createBooking
);

router.get("/", followControllers.userToFollow);
router.get("/my-bookings", auth("user"), followControllers.getMyBookings);
router.get(
  "/my-booking/:id",
  auth("user"),
  followControllers.getMySingleBooking
);
export const followRoutes = router;
