import mongoose, { Schema, Types } from "mongoose";

export interface IState {
  name: string;
  slug: string;
  code?: string;
  description?: string;
  isActive: boolean;
  isDeleted: boolean;
  created_by?: Types.ObjectId;
  updated_by?: Types.ObjectId;
  created_at?: Date;
  updated_at?: Date;
}

const stateSchema = new Schema<IState>(
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

    code: {
      type: String,
      default: "",
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
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

stateSchema.index({ slug: 1 }, { unique: true });
stateSchema.index({ name: 1 });
stateSchema.index({ isDeleted: 1 });
stateSchema.index({ isActive: 1 });

export default mongoose.model<IState>("states", stateSchema);