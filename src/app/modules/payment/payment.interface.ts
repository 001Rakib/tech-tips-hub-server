import { Types } from "mongoose";

export type TPayment = {
  name: string;
  email: string;
  address: string;
  phone: number;
  totalCost: number;
  bookingId: Types.ObjectId;
  carId: Types.ObjectId;
  transactionId: string;
};
