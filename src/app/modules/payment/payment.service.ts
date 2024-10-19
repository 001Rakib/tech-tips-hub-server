import User from "../users/user.model";
import { TPayment } from "./payment.interface";
import { Payment } from "./payment.model";
import { initiatePayment } from "./payment.utils";

const createPaymentIntoDB = async (payload: TPayment) => {
  //update the payment status to paid
  await User.findByIdAndUpdate(
    payload.id,
    { isPremiumMember: true },
    { new: true }
  );

  //payment
  const transactionId = `trn-${Date.now()}`;

  const paymentData = {
    name: payload.name,
    email: payload.email,
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
