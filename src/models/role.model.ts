import mongoose from "mongoose";
import { Role } from "../types/type";

const roleSchema = new mongoose.Schema<Role>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "permission",
      },
    ],

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);


const roleModel = mongoose.model<Role>(
  "role",
  roleSchema
);

export default roleModel;