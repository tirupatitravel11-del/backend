import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    vehicleType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VehicleType",
      required: true,
    },

    vehicleName: {
      type: String,
      required: true,
    },

    brand: String,

    model: String,

    registrationNumber: {
      type: String,
      unique: true,
    },

    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "CNG", "Electric"],
    },

    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
    },

    seatCapacity: Number,

    luggageCapacity: Number,

    pricePerKm: Number,

    baseFare: Number,

    images: [String],

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);