import mongoose from "mongoose";

const bookingCabSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phoneNo: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid 10 digit mobile number"],
    },

    serviceType: {
      type: String,
      required: [true, "Service type is required"],
      enum: {
        values: ["cab", "tour", "hotel", "boat","taxi"],
        message: "Invalid service type",
      },
    },

    pickup: {
      type: String,
      required: [true, "Pickup location is required"],
      trim: true,
    },

    drop: {
      type: String,
      required: [true, "Drop location is required"],
      trim: true,
    },
    trip: {
      type: String,
      enum: {
        values: ["one-way", "round-trip"],
        message: "Invalid trip type",
      },
      default: "one-way",
    },

    date: {
      type: String,
      required: [true, "Travel date is required"],
    },

    from: {
      type: String,
      required: false,
      trim: true,
    },

    to: {
      type: String,
      required: false,
      trim: true,
    },

    fare: {
      type: Number,
      required: false,
    },

    vehicle: {
      type: String,
      required: [true, "Vehicle is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const BookingCab =
  mongoose.models.BookingCab || mongoose.model("BookingCab", bookingCabSchema);

export default BookingCab;
