import mongoose, { Schema, Types } from "mongoose";
interface IRoom {
  roomName: string;
  price: number;
}

export interface IHotel {
  name: string;
  slug: string;

  cab_page_id: Types.ObjectId;

  address: string;
  description: string;

  categories: string[];
  amenities: string[];
  images: string[];

  starRating: number;

  priceFrom: number;
  priceTo: number;
  rooms: IRoom[];
  contactNumber: string;
  email: string;
  website: string;

  priority: number;

  isPopular: boolean;

  isActive: boolean;
  isDeleted: boolean;

  created_by?: Types.ObjectId;
  updated_by?: Types.ObjectId;

  created_at?: Date;
  updated_at?: Date;
}

const hotelSchema = new Schema<IHotel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
    },

    cab_page_id: {
      type: Schema.Types.ObjectId,
      ref: "cab_pages",
      required: true,
    },

    address: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    categories: {
      type: [String],
      default: [],
    },

    amenities: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    starRating: {
      type: Number,
      default: 0,
    },

    priceFrom: {
      type: Number,
      default: 0,
    },

    priceTo: {
      type: Number,
      default: 0,
    },
rooms: [
  {
    roomName: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
],
    contactNumber: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    priority: {
      type: Number,
      default: 1,
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
export default mongoose.model<IHotel>("hotel", hotelSchema);