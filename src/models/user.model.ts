import mongoose from "mongoose";
import { User } from "../types/type";


const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
       required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
  gender: {
  type: String,
  enum: ["male", "female", "transgender"],
  required: true,
},

    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role",
      required: true,
    },

    password: {
      type: String,
       required: true,
    },

    is_login: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    token: {
      type: String,
    },

    otp_token: {
      type: String,
    },

    otp_attempts: {
      type: Number,
      default: 0,
    },

    socketId: {
      type: String,
      default: null,
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: Number,
      default: 1,
    },

    otp_verified: {
      type: Boolean,
      default: false,
    },

    emailStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);


const userModel = mongoose.model<User>(
  "User",
  userSchema
);

export default userModel;