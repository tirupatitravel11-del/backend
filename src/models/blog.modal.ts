import { DateTime } from "luxon";
import mongoose from "mongoose";
import { Blog } from "../types/type";


const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String, 
      required: true,
    },
    tags: {
      type: [String], 
      default: [],
    },
    image: {
      type: String, 
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  
  }
);

const blogModel = mongoose.model<Blog>("blog", blogSchema);
export default blogModel;
