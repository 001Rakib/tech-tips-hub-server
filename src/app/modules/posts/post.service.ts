/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { IVotePayload, TPost } from "./post.interface";
import Post from "./post.model";
import { QueryBuilder } from "../../builder/QueryBuilder";
import { PostSearchableFields } from "./post.constant";
import { Types } from "mongoose";

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

//for upVoting post
const upVotePostIntoDB = async (payload: IVotePayload) => {
  const { postId, user } = payload;

  try {
    if (!postId || !user) {
      throw new AppError(httpStatus.BAD_REQUEST, "Required parameters missing");
    }

    // Validate ObjectId
    if (!Types.ObjectId.isValid(postId) || !Types.ObjectId.isValid(user)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid ObjectId format");
    }

    const userObjectId = new Types.ObjectId(user);

    const post = await Post.findById(postId).select("upVote");

    if (!post) {
      throw new AppError(httpStatus.BAD_REQUEST, "Post Not Found");
    }

    const hasVoted = post.upVote.some((upVoteUser: Types.ObjectId) =>
      upVoteUser.equals(userObjectId)
    );

    let result;
    if (hasVoted) {
      // Atomic operation to remove the vote
      result = await Post.findByIdAndUpdate(
        postId,
        { $pull: { upVote: userObjectId } },
        { new: true } // Return the updated document
      );
    } else {
      // Atomic operation to add the vote
      result = await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { upVote: userObjectId } }, // Prevent duplicate entries
        { new: true }
      );
    }

    return result;
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "An error occurred"
    );
  }
};
//for downVoting post
const downVotePostIntoDB = async (payload: IVotePayload) => {
  const { postId, user } = payload;

  try {
    if (!postId || !user) {
      throw new AppError(httpStatus.BAD_REQUEST, "Required parameters missing");
    }

    // Validate ObjectId
    if (!Types.ObjectId.isValid(postId) || !Types.ObjectId.isValid(user)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid ObjectId format");
    }

    const userObjectId = new Types.ObjectId(user);

    const post = await Post.findById(postId).select("downVote");

    if (!post) {
      throw new AppError(httpStatus.BAD_REQUEST, "Post Not Found");
    }

    const hasVoted = post.downVote.some((downVoteUser: Types.ObjectId) =>
      downVoteUser.equals(userObjectId)
    );

    let result;
    if (hasVoted) {
      // Atomic operation to remove the vote
      result = await Post.findByIdAndUpdate(
        postId,
        { $pull: { downVote: userObjectId } },
        { new: true } // Return the updated document
      );
    } else {
      // Atomic operation to add the vote
      result = await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { downVote: userObjectId } }, // Prevent duplicate entries
        { new: true }
      );
    }

    return result;
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "An error occurred"
    );
  }
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
  upVotePostIntoDB,
  downVotePostIntoDB,
};
