import mongoose, { Schema, Types } from "mongoose";

export interface IHotel {
  name: string;
  slug: string;

  cab_page_id: Types.ObjectId;

  categories: string[];

  address?: string;
  description?: string;

  images: string[];

  starRating: number;

  priceFrom?: number;
  priceTo?: number;

  amenities: string[];

  contactNumber?: string;
  website?: string;
  email?: string;

  checkInTime?: string;
  checkOutTime?: string;

  latitude?: number;
  longitude?: number;

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };

  isPopular: boolean;
  sortOrder: number;

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
      ref: "CabPage",
      required: true,
    },

    categories: {
      type: [String],
      default: [],
    },

    address: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    starRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    priceFrom: {
      type: Number,
      default: null,
    },

    priceTo: {
      type: Number,
      default: null,
    },

    amenities: {
      type: [String],
      default: [],
    },

    contactNumber: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    checkInTime: {
      type: String,
      default: "",
    },

    checkOutTime: {
      type: String,
      default: "",
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    seo: {
      metaTitle: {
        type: String,
        default: "",
      },
      metaDescription: {
        type: String,
        default: "",
      },
      metaKeywords: {
        type: [String],
        default: [],
      },
    },

    isPopular: {
      type: Boolean,
      default: false,
    },

    sortOrder: {
      type: Number,
      default: 0,
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
      ref: "User",
      default: null,
    },

    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
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



const HotelModel = mongoose.model<IHotel>("Hotel", hotelSchema);

export default HotelModel;