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
    passwordHash: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    fcmToken: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    verificationOtp: {
      type: String,
      default: null,
    },
    verificationOtpExpires: {
      type: Date,
      default: null,
    },
    resetOtp: {
      type: String,
      default: null,
    },
    resetOtpExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const User = models.User || model("User", UserSchema);
export default User;