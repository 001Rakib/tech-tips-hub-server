import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { TPost } from "./post.interface";
import Post from "./post.model";
import { QueryBuilder } from "../../builder/QueryBuilder";
import { PostSearchableFields } from "./post.constant";

const createPostIntoDB = async (payload: TPost) => {
  const result = await Post.create(payload);
  return result;
};

const getAllPostFromDB = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(
    Post.find().populate(
      "author upVote downVote comments.user comments.vote comments.content"
    ),
    query
  )
    .filter()
    .search(PostSearchableFields)
    .sort()
    // .paginate()
    .fields();

  const result = await postQuery.modelQuery;
  return result;
};

const getSinglePostFromDB = async (id: string) => {
  const result = await Post.findById(id).populate(
    "author upVote downVote comments.user comments.vote comments.content"
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  return result;
};

const updatePostIntoDB = async (id: string, payload: Partial<TPost>) => {
  //check if the car available in the database
  const isPostExists = await Post.findById(id);

  if (!isPostExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  const result = await Post.findByIdAndUpdate(id, payload, {
    new: true,
    upsert: true,
  });
  return result;
};

const deletePostFromDB = async (id: string) => {
  //check if the car available in the database
  const isPostExists = await Post.findById(id);

  if (!isPostExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  const result = await Post.findByIdAndDelete(id);
  return result;
};

export const postServices = {
  createPostIntoDB,
  getAllPostFromDB,
  getSinglePostFromDB,
  deletePostFromDB,
  updatePostIntoDB,
};
