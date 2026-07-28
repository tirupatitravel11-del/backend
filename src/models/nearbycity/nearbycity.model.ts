import mongoose, { Schema, Types } from "mongoose";

export interface INearbyCity {
  route_id: Types.ObjectId;

  cities: string[];

  isActive: boolean;

  isDeleted: boolean;

  created_by?: Types.ObjectId;

  updated_by?: Types.ObjectId;

  created_at?: Date;

  updated_at?: Date;
}

const nearbyCitySchema = new Schema<INearbyCity>(
  {
    route_id: {
      type: Schema.Types.ObjectId,
      ref: "routes",
      required: true,
      unique: true,
    },

    cities: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      required: true,
      default: [],
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

export default mongoose.model<INearbyCity>(
  "NearbyCity",
  nearbyCitySchema,
  "nearby_cities"
);