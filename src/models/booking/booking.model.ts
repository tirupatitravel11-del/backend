import mongoose, { Document, Schema } from "mongoose";

export interface IBookingRequest extends Document {
  name: string;
  phone: string;
  serviceType: "cab" | "tour" | "hotel" | "boat";
  createdAt: Date;
  updatedAt: Date;
}

const bookingRequestSchema = new Schema<IBookingRequest>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    serviceType: {
      type: String,
      required: [true, "Service type is required"],
      enum: {
        values: ["cab", "tour", "hotel", "boat"],
        message: "Invalid service type",
      },
    },
  },
  {
    timestamps: true,
  }
);

const BookingRequest =
  mongoose.models.BookingRequest ||
  mongoose.model<IBookingRequest>(
    "BookingRequest",
    bookingRequestSchema
  );

export default BookingRequest;