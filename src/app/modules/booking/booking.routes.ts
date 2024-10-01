import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { bookingValidationSchema } from "./booking.validation";
import { bookingControllers } from "./booking.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post(
  "/",
  auth("user", "admin"),
  validateRequest(bookingValidationSchema.createBookingValidationSchema),
  bookingControllers.createBooking
);

router.get("/", auth("admin"), bookingControllers.getAllBookings);
router.get("/my-bookings", auth("user"), bookingControllers.getMyBookings);
router.get(
  "/my-booking/:id",
  auth("user"),
  bookingControllers.getMySingleBooking
);
export const bookingRoutes = router;
