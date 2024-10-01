import { Schema, model } from "mongoose";
import { TPayment } from "./payment.interface";

const paymentSchema = new Schema<TPayment>(
  {
    name: { type: String },
    email: { type: String, required: true },
    phone: { type: Number },
    address: { type: String },
    transactionId: { type: String },
    totalCost: { type: Number },
    carId: { type: Schema.Types.ObjectId, ref: "car" },
    bookingId: { type: Schema.Types.ObjectId, ref: "booking" },
  },
  {
    timestamps: true,
  }
);
export const Payment = model<TPayment>("Payment", paymentSchema);
