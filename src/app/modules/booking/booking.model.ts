import { Schema, model } from "mongoose";
import { TBooking } from "./booking.interface";

const bookingSchema = new Schema<TBooking>(
  {
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    drivingLicense: { type: String, required: true },
    nid: { type: String, required: true },
    endTime: { type: String, default: null },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    carId: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },

    totalCost: {
      type: Number,
      default: 0,
    },
    payment: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
export const Booking = model<TBooking>("Booking", bookingSchema);
