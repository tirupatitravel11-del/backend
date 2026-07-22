import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },

    pickupLocation: {
      type: String,
      required: true,
    },

    dropLocation: {
      type: String,
      required: true,
    },

    pickupDate: {
      type: Date,
      required: true,
    },

    pickupTime: {
      type: String,
      required: true,
    },

    // One Way / Round Trip
    tripType: {
      type: String,
      enum: ["One Way", "Round Trip"],
      default: "One Way",
    },

    // Sirf Round Trip me use hoga
    returnDate: {
      type: Date,
      default: null,
    },

    totalKm: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    specialInstruction: {
      type: String,
      default: "",
    },

    bookingStatus: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Rejected",
        "Ongoing",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Validation: Return Date sirf Round Trip me required hogi
bookingSchema.pre("save", async function () {
  if (this.tripType === "Round Trip" && !this.returnDate) {
    throw new Error("Return Date is required for Round Trip.");
  }
});
export default mongoose.model("Booking", bookingSchema);