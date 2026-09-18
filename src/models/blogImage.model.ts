import mongoose from "mongoose";

const BlogImageSchema =
  new mongoose.Schema(
    {
      fileName: {
        type: String,
        required: true,
      },

      contentType: {
        type: String,
        required: true,
      },

      data: {
        type: Buffer,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.models.BlogImage ||
  mongoose.model(
    "BlogImage",
    BlogImageSchema
  );