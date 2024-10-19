import { Schema, model } from "mongoose";
import { TPayment } from "./payment.interface";

const paymentSchema = new Schema<TPayment>(
  {
    id: { type: Schema.Types.ObjectId },
    name: { type: String },
    email: { type: String, required: true },
    transactionId: { type: String },
    totalCost: { type: Number },
  },
  {
    timestamps: true,
  }
);
export const Payment = model<TPayment>("Payment", paymentSchema);
