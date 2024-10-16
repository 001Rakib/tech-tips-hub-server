import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { followServices } from "./follow.service";
import sendResponse from "../../utils/sendResponse";

const userToFollow = catchAsync(async (req, res) => {
  const { id } = req.query;
  const result = await followServices.userToFollow(id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User to follow retrieved successfully",
    data: result,
  });
});
const createBooking = catchAsync(async (req, res) => {
  const result = await followServices.createBookingIntoDB(req.body, req.user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Car booked successfully",
    data: result,
  });
});
const getMyBookings = catchAsync(async (req, res) => {
  const result = await followServices.getMyBookings(req.user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My Bookings retrieved successfully",
    data: result,
  });
});
const getMySingleBooking = catchAsync(async (req, res) => {
  const result = await followServices.getMySingleBooking(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My Booking retrieved successfully",
    data: result,
  });
});

export const followControllers = {
  createBooking,
  getMyBookings,
  userToFollow,
  getMySingleBooking,
};
