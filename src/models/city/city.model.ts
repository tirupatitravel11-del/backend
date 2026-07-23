import mongoose, { Schema, Types } from "mongoose";

export interface ICity {
  name: string;
  slug: string;
  state_id: Types.ObjectId;
  description?: string;
  image?: string;
  isPopular: boolean;
  isActive: boolean;
  isDeleted: boolean;
  sortOrder: number;
  created_by?: Types.ObjectId;
  updated_by?: Types.ObjectId;
  created_at?: Date;
  updated_at?: Date;
}

const citySchema = new Schema<ICity>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    state_id: {
      type: Schema.Types.ObjectId,
      ref: "states",
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
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

    sortOrder: {
      type: Number,
      default: 0,
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

citySchema.index({ slug: 1 });
citySchema.index({ state_id: 1 });
citySchema.index({ name: 1 });
citySchema.index({ isPopular: 1 });

export default mongoose.model<ICity>("cities", citySchema);