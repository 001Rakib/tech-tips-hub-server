import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { TSignInUser, TUser } from "./user.interface";
import { User } from "./user.model";
import { createToken } from "../auth/auth.utils";
import config from "../../config";
import jwt, { JwtPayload } from "jsonwebtoken";

const signUpUserIntoDB = async (payload: TUser) => {
  //check if the user is already registered
  const isUserExists = await User.isUserExistsByEmail(payload.email);
  if (isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already registered!!");
  }

  //set user role
  payload.role = "user";

  const result = await User.create(payload);
  return result;
};

const signInUser = async (payload: TSignInUser) => {
  //checking if the user is registered in the DB
  const userData = await User.isUserExistsByEmail(payload.email);

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  //check if the password matched
  if (!(await User.isPasswordMatched(payload?.password, userData?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Wrong Password");
  }

  await User.findOne({ email: payload.email });

  //create token and send to the client
  const jwtPayload = {
    email: userData?.email,
    role: userData?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_token as string,
    config.jwt_access_expires_in as string
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_token as string,
    config.jwt_refresh_expired_in as string
  );

  return {
    token: accessToken,
    refreshToken,
  };
};

const getAllUserFromDB = async () => {
  const result = await User.find();
  return result;
};

const getUserFromDB = async (email: string) => {
  const result = await User.findOne({ email: email });
  return result;
};

const refreshToken = async (token: string) => {
  //verify token
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_token as string
  ) as JwtPayload;
  const { email } = decoded;

  //if the user is register in DB
  const userData = await User.isUserExistsByEmail(email);

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  //create
  const jwtPayload = {
    email: userData?.email,
    role: userData?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_token as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};

export const userServices = {
  signUpUserIntoDB,
  signInUser,
  refreshToken,
  getUserFromDB,
  getAllUserFromDB,
};
