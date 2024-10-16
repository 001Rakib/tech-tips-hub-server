import { JwtPayload } from "jsonwebtoken";
import { TBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import User from "../users/user.model";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

const userToFollow = async (id: string) => {
  if (!id) {
    throw new AppError(httpStatus.NOT_FOUND, "NO Id Provided");
  }

  const currentUser = await User.findById(id).select("following").lean();

  if (
    !currentUser ||
    !Array.isArray(currentUser.following) ||
    currentUser.following.length === 0
  ) {
    const whoToFollow = await User.find({
      _id: { $ne: id },
    })
      .select("_id name email isPremiumMember profileImg")
      .sort({ createdAt: -1 });

    return whoToFollow;
  }

  const userToFollow = await User.find({
    _id: {
      $nin: [...currentUser.following, id],
    },
  })
    .select("_id name email isPremiumMember profileImg")
    .sort({ createdAt: -1 });

  return userToFollow;
};

const createBookingIntoDB = async (payload: TBooking, userInfo: JwtPayload) => {
  const user = await User.findOne({ email: userInfo?.email });

  if (user) {
    //set the logged in user Object id while booking a car
    payload.user = user?._id;
  }
  //update the car status to unavailable
  await User.findByIdAndUpdate(
    payload.carId,
    { status: "unavailable" },
    { new: true }
  );
  const result = (
    await (await Booking.create(payload)).populate("user")
  ).populate("carId");
  return result;
};

const getMyBookings = async (userInfo: JwtPayload) => {
  const bookingUserData = await User.findOne({ email: userInfo?.email });

  const result = await Booking.find({ user: bookingUserData?._id })
    .populate("user")
    .populate("carId");

  return result;
};
const getMySingleBooking = async (id: string) => {
  const result = await Booking.findById(id).populate("user").populate("carId");

  return result;
};

export const followServices = {
  createBookingIntoDB,
  getMyBookings,
  userToFollow,
  getMySingleBooking,
};
