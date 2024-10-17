import { Types } from "mongoose";

export type TFollowPayload = {
  follower: Types.ObjectId;
  following: Types.ObjectId;
};
