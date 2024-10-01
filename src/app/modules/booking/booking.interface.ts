import { Types } from "mongoose";

export type TBooking = {
  date: string;
  user: Types.ObjectId;
  carId: Types.ObjectId;
  startTime: string;
  endTime: string;
  totalCost: number;
  nid: string;
  drivingLicense: string;
  payment: "pending" | "paid";
};
export type TReturnCar = {
  bookingId: Types.ObjectId;
  endTime: string;
};
