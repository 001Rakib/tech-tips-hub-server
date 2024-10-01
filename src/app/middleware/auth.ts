import httpStatus from "http-status";
import AppError from "../error/AppError";
import { TUserRole } from "../modules/users/user.interface";
import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { User } from "../modules/users/user.model";
import { NextFunction, Request, Response } from "express";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You have no access to this route"
      );
    }

    //verify token
    const decoded = jwt.verify(
      token,
      config.jwt_access_token as string
    ) as JwtPayload;
    const { email, role } = decoded;

    //if the user is register in DB
    const userData = await User.isUserExistsByEmail(email);

    if (!userData) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    //check if the role is matching
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You have no access to this route"
      );
    }

    //decode data
    req.user = decoded as JwtPayload;
    next();
  });
};
export default auth;
