import mongoose from "mongoose";
import { Iblog } from "../types/type";

const BlogSchema = new mongoose.Schema({
  title: String,
  author: { type: String },
  authorRole: { type: String },
  slug: { type: String, unique: true },
  content: Object, // Editor.js JSON
  blogstatus: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  publisheddate: { type: Date },
  status: { type: Number, default: 13 },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

const BlogModel = mongoose.model<Iblog>("Blog", BlogSchema);
export default BlogModel