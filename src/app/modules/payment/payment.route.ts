import { Router } from "express";
import { paymentController } from "./payment.controller";

const router = Router();

router.post("/", paymentController.createPayment);
router.post("/payment-confirmation", paymentController.paymentConfirmation);

export const paymentRoute = router;
