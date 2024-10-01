import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { TCar } from "./car.interface";
import { Car } from "./car.model";
import { TReturnCar } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { convertTimeToHours } from "./car.utils";

const createCarIntoDB = async (payload: TCar) => {
  const result = await Car.create(payload);
  return result;
};

const getAllCarFromDB = async (query: Record<string, unknown>) => {
  // const queryObj = { ...query };

  //search product
  let searchCar = "";
  const carSearchableFields = ["name", "description", "category", "features"];
  if (query.searchCar) {
    searchCar = query?.searchCar as string;
  }

  const searchQuery = Car.find({
    $or: carSearchableFields.map((field) => ({
      [field]: { $regex: searchCar, $options: "i" },
    })),
  });

  //filtering
  // const excludeFields = ["searchCar", "sort"];
  // excludeFields.forEach((elem) => delete queryObj[elem]);

  // const filterQuery = searchQuery.find(queryObj);

  const result = await searchQuery;
  return result;
};

const getSingleCarFromDB = async (id: string) => {
  const result = await Car.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Car not found");
  }

  return result;
};

const returnCar = async (payload: TReturnCar) => {
  const id = payload.bookingId;

  const bookingData = await Booking.findById(id);
  const carData = await Car.findById(bookingData?.carId);

  //check if the booking data is available on the database

  if (!bookingData) {
    throw new AppError(httpStatus.NOT_FOUND, "This booking id is not found");
  }

  if (bookingData && carData) {
    const startTime = convertTimeToHours(bookingData.startTime);
    const endTime = convertTimeToHours(payload.endTime);

    const totalCost = (endTime - startTime) * carData.pricePerHour;

    // update the car status to available
    await Car.findByIdAndUpdate(
      bookingData?.carId,
      {
        status: "available",
      },
      { new: true }
    );

    //set the end time and total cost
    const result = await Booking.findByIdAndUpdate(
      id,
      { endTime: payload.endTime, totalCost: totalCost },
      { new: true }
    )
      .populate("user")
      .populate("carId");

    return result;
  }
};

const updateCarIntoDB = async (id: string, payload: Partial<TCar>) => {
  //check if the car available in the database
  const isCarExists = await Car.findById(id);

  if (!isCarExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Car not found");
  }

  const result = await Car.findByIdAndUpdate(id, payload, {
    new: true,
    upsert: true,
  });
  return result;
};

const deleteCarFromDB = async (id: string) => {
  //check if the car available in the database
  const isCarExists = await Car.findById(id);

  if (!isCarExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Car not found");
  }

  const result = await Car.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};

export const carServices = {
  createCarIntoDB,
  getAllCarFromDB,
  getSingleCarFromDB,
  deleteCarFromDB,
  updateCarIntoDB,
  returnCar,
};
