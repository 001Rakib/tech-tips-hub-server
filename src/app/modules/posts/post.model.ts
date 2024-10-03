import { Schema, model } from "mongoose";
import { TPost } from "./post.interface";

const postSchema = new Schema<TPost>(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    author: {
      type: String,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
    },
    status: {
      type: String,
      enum: ["free", "premium"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

postSchema.pre("find", async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
postSchema.pre("findOne", async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Post = model<TPost>("Post", postSchema);
