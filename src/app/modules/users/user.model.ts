import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const userSchema = new Schema<TUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
      default: "user",
    },
    username: { type: String, required: true, unique: true, trim: true },
    profileImg: { type: String, required: false },
    password: { type: String, required: true, select: false },
    isPremiumMember: { type: Boolean, required: true, default: false },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isBlocked: { type: Boolean, required: true, default: false },
    lastLogin: { type: Date, required: false },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_round_salt)
    );
  }
  next();
});

// Custom method to exclude password from the response
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Static method for verifying password
userSchema.methods.verifyPassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = model<TUser>("User", userSchema);

export default User;
