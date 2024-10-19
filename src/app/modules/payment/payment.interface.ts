import { Types } from "mongoose";

export type TPayment = {
  id: Types.ObjectId;
  name: string;
  email: string;
  totalCost: number;
  transactionId: string;
};
