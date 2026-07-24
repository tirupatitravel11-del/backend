import mongoose, { Schema, Types } from "mongoose";

export interface IRoute {
  from_state_id: Types.ObjectId;
  from_city_id: Types.ObjectId;

  to_state_id: Types.ObjectId;
  to_city_id: Types.ObjectId;

  slug: string;
  distance: number;
  duration: string;

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

const routeSchema = new Schema<IRoute>(
  {
    from_state_id: {
      type: Schema.Types.ObjectId,
      ref: "states",
      required: true,
    },

    from_city_id: {
      type: Schema.Types.ObjectId,
      ref: "cities",
      required: true,
    },

    to_state_id: {
      type: Schema.Types.ObjectId,
      ref: "states",
      required: true,
    },

    to_city_id: {
      type: Schema.Types.ObjectId,
      ref: "cities",
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    distance: {
      type: Number,
      required: true,
      min: 0,
    },

    duration: {
      type: String,
      default: "",
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

routeSchema.index(
  {
    from_city_id: 1,
    to_city_id: 1,
  },
  {
    unique: true,
  }
);

routeSchema.index({ slug: 1 }, { unique: true });
routeSchema.index({ isPopular: 1 });
routeSchema.index({ isActive: 1 });
routeSchema.index({ isDeleted: 1 });

export default mongoose.model<IRoute>("routes", routeSchema);