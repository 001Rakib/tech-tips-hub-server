import { TPayment } from "./payment.interface";
import { Payment } from "./payment.model";
import { Booking } from "../booking/booking.model";
import { initiatePayment } from "./payment.utils";

const createPaymentIntoDB = async (payload: TPayment) => {
  //update the payment status to paid
  await Booking.findByIdAndUpdate(
    payload.bookingId,
    { payment: "paid" },
    { new: true }
  );

  //payment
  const transactionId = `trn-${Date.now()}`;

  const paymentData = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    address: payload.address,
    totalCost: payload.totalCost,
    transactionId,
  };

  const paymentResponse = await initiatePayment(paymentData);
  await Payment.create(payload);

  return paymentResponse;
};
export const paymentService = {
  createPaymentIntoDB,
};
