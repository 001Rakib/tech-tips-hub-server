import { Model } from "mongoose";
export const userRole = {
  user: "user",
  admin: "admin",
} as const;

export type TUser = {
  name: string;
  email: string;
  role: "user" | "admin";
  password: string;
  profilePicture: string;
};
export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}
export type TSignInUser = {
  email: string;
  password: string;
};
export type TUserRole = keyof typeof userRole;
