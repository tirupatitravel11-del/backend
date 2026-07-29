import mongoose, { Schema, Types } from "mongoose";

export interface IRouteSeo {
  route_id: Types.ObjectId;

  metaTitle: string;

  metaDescription: string;

  metaKeywords: string[];

  canonicalUrl: string;

  ogTitle: string;

  ogDescription: string;

  ogImage: string;

  schemaMarkup: string;

  robots: string;

  isActive: boolean;

  isDeleted: boolean;

  created_by?: Types.ObjectId;

  updated_by?: Types.ObjectId;

  created_at?: Date;

  updated_at?: Date;
}

const routeSeoSchema = new Schema<IRouteSeo>(
  {
    route_id: {
      type: Schema.Types.ObjectId,
      ref: "routes",
      required: true,
      unique: true,
    },

    metaTitle: {
      type: String,
      required: true,
      trim: true,
    },

    metaDescription: {
      type: String,
      required: true,
      trim: true,
    },

    metaKeywords: [
      {
        type: String,
        trim: true,
      },
    ],

    canonicalUrl: {
      type: String,
      default: "",
    },

    ogTitle: {
      type: String,
      default: "",
    },

    ogDescription: {
      type: String,
      default: "",
    },

    ogImage: {
      type: String,
      default: "",
    },

    schemaMarkup: {
      type: String,
      default: "",
    },

    robots: {
      type: String,
      default: "index,follow",
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
    },

    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
  }
);

export default mongoose.model<IRouteSeo>(
  "route_seo",
  routeSeoSchema
);