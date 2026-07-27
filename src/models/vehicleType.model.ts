import mongoose, { Schema, Types } from "mongoose";

export interface ICabType {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  tags: string[];
  sortOrder: number;
  isPopular: boolean;
  isActive: boolean;
  isDeleted: boolean;
  created_by?: Types.ObjectId;
  updated_by?: Types.ObjectId;
  created_at?: Date;
  updated_at?: Date;
}

const cabTypeSchema = new Schema<ICabType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    sortOrder: {
      type: Number,
      default: 0,
    },

    isPopular: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    created_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },

    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// cabTypeSchema.index({ slug: 1 }, { unique: true });
// cabTypeSchema.index({ name: 1 });
// cabTypeSchema.index({ isPopular: 1 });
// cabTypeSchema.index({ sortOrder: 1 });

export default mongoose.model<ICabType>("cabtypes", cabTypeSchema);