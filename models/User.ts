// models/User.ts (or your path to User schema)
import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false, // Users starts as unverified
    },
    verificationToken: {
      type: String,
      default: null, // Holds the active verification token
    },
    verificationTokenExpires: {
      type: Date,
      default: null, // Expiry timestamp for the token
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;