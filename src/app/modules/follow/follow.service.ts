import { JwtPayload } from "jsonwebtoken";
import { TFollowPayload } from "./follow.interface";
import { Booking } from "./booking.model";
import User from "../users/user.model";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import mongoose from "mongoose";

//find user to follow
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

//follow users
const followUser = async (payload: TFollowPayload) => {
  const { follower, following } = payload;

  let session = null;

  try {
    if (!follower || !following) {
      throw new AppError(httpStatus.BAD_REQUEST, "Required parameters missing");
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const updatedFollower = await User.findByIdAndUpdate(
      follower,
      { $addToSet: { following: following } },
      { new: true, session } // Pass session to ensure atomicity
    );

    const updatedFollowing = await User.findByIdAndUpdate(
      following,
      { $addToSet: { followers: follower } },
      { new: true, session } // Pass session to ensure atomicity
    );

    if (!updatedFollower || !updatedFollowing) {
      await session.abortTransaction();
      return new AppError(
        httpStatus.FORBIDDEN,
        "Failed to update follower or following"
      );
    }

    await session.commitTransaction();
    session.endSession();

    return "User Successfully Followed";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // If an error occurs, rollback by aborting the transaction
    if (session) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(error);
    }
  }
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
  followUser,
  getMyBookings,
  userToFollow,
  getMySingleBooking,
};
