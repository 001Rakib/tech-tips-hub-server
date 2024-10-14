import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { TPost } from "./post.interface";
import { Post } from "./post.model";

const createPostIntoDB = async (payload: TPost) => {
  const result = await Post.create(payload);
  return result;
};

const getAllPostFromDB = async (query: Record<string, unknown>) => {
  // const queryObj = { ...query };

  //search product
  let searchCar = "";
  const carSearchableFields = ["name", "description", "category", "features"];
  if (query.searchCar) {
    searchCar = query?.searchCar as string;
  }

  const searchQuery = Post.find({
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

const getSinglePostFromDB = async (id: string) => {
  const result = await Post.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  return result;
};

const updateCarIntoDB = async (id: string, payload: Partial<TPost>) => {
  //check if the car available in the database
  const isCarExists = await Post.findById(id);

  if (!isCarExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Car not found");
  }

  const result = await Post.findByIdAndUpdate(id, payload, {
    new: true,
    upsert: true,
  });
  return result;
};

const deleteCarFromDB = async (id: string) => {
  //check if the car available in the database
  const isCarExists = await Post.findById(id);

  if (!isCarExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Car not found");
  }

  const result = await Post.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};

export const postServices = {
  createPostIntoDB,
  getAllPostFromDB,
  getSinglePostFromDB,
  deleteCarFromDB,
  updateCarIntoDB,
};
