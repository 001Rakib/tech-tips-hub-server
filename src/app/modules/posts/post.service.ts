/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../error/AppError";
import {
  ICommentPayload,
  IEditCommentPayload,
  IVotePayload,
  TPost,
} from "./post.interface";
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
      "author upVote downVote comments.user comments.vote comments.comment"
    ),
    query
  )
    .search(PostSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await postQuery.modelQuery;
  return result;
};

const getSinglePostFromDB = async (id: string) => {
  const result = await Post.findById(id).populate(
    "author upVote downVote comments.user comments.vote comments.comment"
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
//for commenting on post
const commentOnPost = async (payload: ICommentPayload) => {
  const { user, comment, postId } = payload;

  try {
    // Validate that the payload has the required fields
    if (!user || !comment) {
      throw new AppError(httpStatus.BAD_REQUEST, "Required parameters missing");
    }

    // Ensure user is a valid ObjectId
    if (!Types.ObjectId.isValid(user)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid User ID");
    }

    // Convert user to ObjectId
    const userObjectId = new Types.ObjectId(user);

    // Retrieve post and its comments
    const post = await Post.findById(postId).select("comments");

    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, "Post Not Found");
    }

    // Add the new comment to the post's comments array
    post.comments.push({
      user: userObjectId,
      comment: comment,
      createdAt: new Date(),
    });

    // Save the updated post document
    const updatedPost = await post.save();

    return updatedPost.comments; // Returning only comments,
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "An error occurred"
    );
  }
};

const editCommentOnPost = async (payload: IEditCommentPayload) => {
  const { user, comment, commentId, postId } = payload;

  try {
    // Validate that the payload has the required fields
    if (!user || !comment || !commentId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Required parameters missing");
    }

    // Ensure user and commentId are valid ObjectIds
    if (!Types.ObjectId.isValid(user) || !Types.ObjectId.isValid(commentId)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Invalid User ID or Comment ID"
      );
    }

    // Convert user and commentId to ObjectId
    const userObjectId = new Types.ObjectId(user);
    const commentObjectId = new Types.ObjectId(commentId);

    // Retrieve the post by postId and ensure it exists
    const post = await Post.findById(postId).select("comments");

    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, "Post Not Found");
    }

    // Find the comment to be updated in the post's comments array
    const commentToEdit = post.comments.find(
      (c) => c._id!.equals(commentObjectId) && c.user.equals(userObjectId)
    );

    if (!commentToEdit) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Comment Not Found or User Unauthorized"
      );
    }

    // Update the comment content
    commentToEdit.comment = comment;
    commentToEdit.updatedAt = new Date();

    // Save the updated post document
    const updatedPost = await post.save();

    return updatedPost.comments; // Return the updated comments array
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "An error occurred"
    );
  }
};

const deleteComment = async (query: Record<string, unknown>) => {
  try {
    // Validate that the payload has the required fields
    if (!query.user || !query.commentId || !query.postId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Required parameters missing");
    }

    // Ensure postId, commentId, and user are valid ObjectIds
    if (!Types.ObjectId.isValid(query.postId as string)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid Post ID");
    }

    if (!Types.ObjectId.isValid(query.commentId as string)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid Comment ID");
    }

    if (!Types.ObjectId.isValid(query.user as string)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid User ID");
    }

    // Convert to ObjectId
    const postObjectId = new Types.ObjectId(query.postId as string);
    const commentObjectId = new Types.ObjectId(query.commentId as string);
    const userObjectId = new Types.ObjectId(query.user as string);

    // Retrieve the post by postId and ensure it exists
    const post = await Post.findById(postObjectId).select("comments");

    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, "Post Not Found");
    }

    // Find the comment to be deleted in the post's comments array
    const commentIndex = post.comments.findIndex(
      (c) => c._id!.equals(commentObjectId) && c.user.equals(userObjectId)
    );

    if (commentIndex === -1) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Comment Not Found or User Unauthorized"
      );
    }

    // Remove the comment from the post's comments array
    post.comments.splice(commentIndex, 1);

    // Save the updated post document
    await post.save();

    return { message: "Comment deleted successfully" };
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
  commentOnPost,
  editCommentOnPost,
  deleteComment,
};
