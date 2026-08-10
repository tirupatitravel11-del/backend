import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface IPackageHub extends Document {
  title: string;
  slug: string;

  cab_page_id: mongoose.Types.ObjectId;

  shortDescription: string;
  description: string;

  featuredImage: string;
  gallery: string[];

  days: number;
  nights: number;

  startingPrice: number;

  vehiclePricing: {
    vehicleType: string;
    price: number;
  }[];

  tags: string[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];

  itinerary: {
    day: number;
    title: string;
    activities: string[];
  }[];

  isFeatured: boolean;
  isPopular: boolean;
  status: boolean;

  isDeleted: boolean;

  created_by?: mongoose.Types.ObjectId;
  updated_by?: mongoose.Types.ObjectId;

  created_at?: Date;
  updated_at?: Date;
}

const packageHubSchema = new Schema<IPackageHub>(
  {
    // =========================
    // Basic Details
    // =========================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    // =========================
    // City
    // =========================

    cab_page_id: {
      type: Schema.Types.ObjectId,
      ref: "cab_pages",
      required: true,
    },

    // =========================
    // Description
    // =========================

    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    // =========================
    // Images
    // =========================

    featuredImage: {
      type: String,
      default: "",
    },

    gallery: {
      type: [String],
      default: [],
    },

    // =========================
    // Duration
    // =========================

    days: {
      type: Number,
      required: true,
      min: 1,
    },

    nights: {
      type: Number,
      required: true,
      min: 0,
    },

    // =========================
    // Price
    // =========================

    startingPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

  
    // =========================
    // Tags
    // =========================

    tags: {
      type: [String],
      default: [],
    },

    // =========================
    // Highlights
    // =========================

    highlights: {
      type: [String],
      default: [],
    },

    // =========================
    // Inclusions
    // =========================

    inclusions: {
      type: [String],
      default: [],
    },

    // =========================
    // Exclusions
    // =========================

    exclusions: {
      type: [String],
      default: [],
    },

    // =========================
    // Itinerary
    // =========================

    itinerary: {
      type: [
        {
          day: {
            type: Number,
            required: true,
            min: 1,
          },

          title: {
            type: String,
            trim: true,
            default: "",
          },

          activities: {
            type: [String],
            default: [],
          },
        },
      ],

      default: [],
    },

    // =========================
    // Package Settings
    // =========================

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isPopular: {
      type: Boolean,
      default: false,
    },

    status: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    // =========================
    // Users
    // =========================

    created_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },

    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },

  // =========================
  // Timestamps
  // =========================

  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },

  },
);

export default mongoose.model<IPackageHub>(
  "package_hubs",
  packageHubSchema,
);