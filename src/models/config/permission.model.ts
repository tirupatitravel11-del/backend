import mongoose from "mongoose";
import { Permission } from "../../types/type";

const permissionSchema = new mongoose.Schema<Permission>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    label: {
      type: String,
      required: true,
    },

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


const permissionModel = mongoose.model<Permission>(
  "permission",
  permissionSchema
);

export default permissionModel;