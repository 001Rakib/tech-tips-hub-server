import { Types } from "mongoose";

export const userRole = {
  user: "user",
  admin: "admin",
} as const;

export type TUser = {
  name: string;
  email: string;
  profileImg?: string;
  password: string;
  isPremiumMember: boolean;
  isBlocked: boolean;
  role: "admin" | "user";
  lastLogin: Date;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
};

export type TSignInUser = {
  email: string;
  password: string;
};
export type TUserRole = keyof typeof userRole;
