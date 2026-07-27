import mongoose, { Schema, Types } from "mongoose";

export interface IVehicle {
  name: string;
  slug: string;
  cab_type_id: Types.ObjectId;
  brand: string;
  description?: string;
  image?: string;
  passengerCapacity: number;
  luggageCapacity: number;
  airCondition: boolean;
  fuelType: "Petrol" | "Diesel" | "CNG" | "Electric";
  transmission: "Manual" | "Automatic";
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

const vehicleSchema = new Schema<IVehicle>(
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

    cab_type_id: {
      type: Schema.Types.ObjectId,
      ref: "cabtypes",
      required: true,
      index: true,
    },

    brand: {
      type: String,
      required: true,
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

    passengerCapacity: {
      type: Number,
      required: true,
      min: 1,
    },

    luggageCapacity: {
      type: Number,
      required: true,
      min: 0,
    },

    airCondition: {
      type: Boolean,
      default: true,
    },

    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "CNG", "Electric"],
      default: "Petrol",
    },

    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      default: "Manual",
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
  },
);

// vehicleSchema.index({ slug: 1 }, { unique: true });
// vehicleSchema.index({ name: 1 });
// vehicleSchema.index({ brand: 1 });
// vehicleSchema.index({ cab_type_id: 1 });
// vehicleSchema.index({ isPopular: 1 });
// vehicleSchema.index({ sortOrder: 1 });
// vehicleSchema.index({ isActive: 1 });
// vehicleSchema.index({ isDeleted: 1 });

export default mongoose.model<IVehicle>("vehicles", vehicleSchema);
