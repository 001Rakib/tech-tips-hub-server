import { model, Schema } from "mongoose";
import { TPost } from "./post.interface";

const postSchema = new Schema<TPost>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
    },
    category: {
      type: String,
      required: true,
    },

    vote: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        content: {
          type: String,
          required: true,
        },
        vote: [
          {
            type: Schema.Types.ObjectId,
            required: false,
            ref: "User",
          },
        ],
        createdAt: {
          type: Date,
          required: true,
        },
        updatedAt: {
          type: Date,
          required: false,
        },
      },
    ],
    shares: {
      type: Number,
      default: 0,
      min: [0, "views count cannot be negative"],
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Post = model<TPost>("Post", postSchema);

export default Post;
