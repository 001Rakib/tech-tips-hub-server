import { Types } from "mongoose";

export interface IVote {
  _id: string;
  name: string;
  email: string;
  isPremiumMember: boolean;
}
export interface IVotePayload {
  postId: Types.ObjectId;
  user: Types.ObjectId;
}

interface IComment {
  user: Types.ObjectId;
  content: string;
  vote: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export type TPost = {
  author: Types.ObjectId;
  title: string;
  shortDescription: string;
  description: string;
  images: string[];
  category: string;
  topics: string[];
  upVote: Types.ObjectId[];
  downVote: Types.ObjectId[];
  comments: IComment[];
  views: number;
  shares: number;
  isPremium: boolean;
};
