import { Router } from "express";
import auth from "../../middleware/auth";
import { paymentController } from "./payment.controller";

const router = Router();

router.post("/", auth("user", "admin"), paymentController.createPayment);
router.post("/payment-confirmation", paymentController.paymentConfirmation);

export const paymentRoute = router;
