import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { createToken } from "../auth/auth.utils";
import config from "../../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "./user.model";
import { TSignInUser, TUser } from "./user.interface";
import bcrypt from "bcrypt";

//register user
const signUpUserIntoDB = async (payload: TUser) => {
  // Check if email or username already exists in one query
  const userExist = await User.findOne({ email: payload.email });

  if (userExist) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is Already Registered");
  }

  const result = await User.create(payload);

  //create token and send to the client
  const jwtPayload = {
    _id: result?._id,
    email: result?.email,
    role: result?.role,
    name: result?.name,
    profilePicture: result?.profileImg,
    isPremiumMember: result?.isPremiumMember,
    lastLogin: result?.lastLogin,
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
    result,
    accessToken,
    refreshToken,
  };
};

//login user
const signInUser = async (payload: TSignInUser) => {
  const { email, password } = payload;

  // checking if the user is exist
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
  }
  //check if the use is blocked
  if (user.isBlocked) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is blocked!");
  }

  //checking if the password is correct

  if (!(await bcrypt.compare(password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");
  }

  user.lastLogin = new Date();
  user.save();

  //create token and sent to the  client

  const jwtPayload = {
    _id: user?._id,
    email: user?.email,
    role: user?.role,
    name: user?.name,
    profilePicture: user?.profileImg,
    isPremiumMember: user?.isPremiumMember,
    lastLogin: user?.lastLogin,
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
    accessToken,
    refreshToken,
  };
};
//update user details
const updateUser = async (id: string, payload: Partial<TUser>) => {
  //check if the car available in the database
  const isUserExists = await User.findById(id);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    upsert: true,
  });
  return result;
};
const updateUserStatus = async (id: string, payload: Partial<TUser>) => {
  //check if the car available in the database
  const isUserExists = await User.findById(id);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  if (payload.role) {
    const result = await User.findByIdAndUpdate(
      id,
      { role: isUserExists.role === "admin" ? "user" : "admin" },
      {
        new: true,
      }
    );
    return result;
  }

  if (payload.isBlocked) {
    const result = await User.findByIdAndUpdate(
      id,
      { isBlocked: isUserExists.isBlocked === false ? true : false },
      {
        new: true,
      }
    );
    return result;
  }
};
//change password
const changePassword = async (payload: {
  oldPassword: string;
  newPassword: string;
  id: string;
}) => {
  //check if the user is registered in the database
  const userData = await User.findById(payload.id).select("password");
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  //check if the user is blocked
  if (userData.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, "The user is blocked");
  }

  //checking if the password is correct (compare payload.oldPassword with userData.password)
  if (!(await bcrypt.compare(payload.oldPassword, userData.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password do not match");
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_round_salt)
  );

  //update the password in the database
  await User.findOneAndUpdate(
    { _id: payload.id },
    { password: newHashedPassword }
  );

  return null;
};

//get all users
const getAllUserFromDB = async () => {
  const result = await User.find()
    .populate({
      path: "following",
      select:
        "_id username name email isEmailVerified isPremiumMember profileImg",
    })
    .populate({
      path: "followers",
      select:
        "_id username name email isEmailVerified isPremiumMember profileImg",
    });
  return result;
};
//get single user
const getUserFromDB = async (id: string) => {
  const result = await User.findById(id)
    .populate({
      path: "following",
      select: "_id username name email isPremiumMember profileImg",
    })
    .populate({
      path: "followers",
      select: "_id username name email isPremiumMember profileImg",
    });
  return result;
};

const deleteUserFromDB = async (id: string) => {
  //check if the car available in the database
  const isUserExists = await User.findById(id);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await User.findByIdAndDelete(id);
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
  const userData = await User.findOne({ email });

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  //create
  const jwtPayload = {
    _id: userData?._id,
    email: userData?.email,
    role: userData?.role,
    name: userData?.name,
    profilePicture: userData?.profileImg,
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
  changePassword,
  updateUser,
  updateUserStatus,
  deleteUserFromDB,
};
