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

    // Convert user to ObjectId for comparison
    const userObjectId = new Types.ObjectId(user);

    const post = await Post.findById(postId).select("upVote");

    if (!post) {
      throw new AppError(httpStatus.BAD_REQUEST, "Post Not Found");
    }

    // Check if the user has already voted (comparing ObjectIds)
    const hasVoted = post.upVote.some((upVoteUser: Types.ObjectId) =>
      upVoteUser.equals(userObjectId)
    );

    if (hasVoted) {
      // Remove the vote (undo)
      post.upVote = post.upVote.filter(
        (upVoteUser: Types.ObjectId) => !upVoteUser.equals(userObjectId)
      );
    } else {
      // Add the vote
      post.upVote.push(userObjectId);
    }

    // Save the updated post document
    const result = await post.save();

    return result;
  } catch (error: any) {
    throw new Error(error);
  }
};
//for upDownVoting post
const downVotePostIntoDB = async (payload: IVotePayload) => {
  const { postId, user } = payload;

  try {
    if (!postId || !user) {
      throw new AppError(httpStatus.BAD_REQUEST, "Required parameters missing");
    }

    // Convert user to ObjectId for comparison
    const userObjectId = new Types.ObjectId(user);

    const post = await Post.findById(postId).select("downVote");

    if (!post) {
      throw new AppError(httpStatus.BAD_REQUEST, "Post Not Found");
    }

    // Check if the user has already voted (comparing ObjectIds)
    const hasVoted = post.downVote.some((downVoteUser: Types.ObjectId) =>
      downVoteUser.equals(userObjectId)
    );

    if (hasVoted) {
      // Remove the vote
      post.downVote = post.downVote.filter(
        (downVoteUser: Types.ObjectId) => !downVoteUser.equals(userObjectId)
      );
    } else {
      // Add the vote
      post.downVote.push(userObjectId);
    }

    // Save the updated post document
    const result = await post.save();

    return result;
  } catch (error: any) {
    throw new Error(error);
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
