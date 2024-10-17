import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { postServices } from "./post.service";

const createPost = catchAsync(async (req, res) => {
  const result = await postServices.createPostIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post created successfully",
    data: result,
  });
});

const getAllPost = catchAsync(async (req, res) => {
  const result = await postServices.getAllPostFromDB(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Posts retrieved successfully",
    data: result,
  });
});
const getSinglePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await postServices.getSinglePostFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "A Post retrieved successfully",
    data: result,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await postServices.updatePostIntoDB(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post updated successfully",
    data: result,
  });
});
const upVotePost = catchAsync(async (req, res) => {
  const result = await postServices.upVotePostIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Up Voted successfully",
    data: result,
  });
});
const downVotePost = catchAsync(async (req, res) => {
  const result = await postServices.downVotePostIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Down Voted successfully",
    data: result,
  });
});
const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await postServices.deletePostFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post Deleted successfully",
    data: result,
  });
});

export const postControllers = {
  createPost,
  getAllPost,
  getSinglePost,
  deletePost,
  updatePost,
  upVotePost,
  downVotePost,
};
