import { Request, Response } from "express";
import Booking from "../models/booking.model";
import Vehicle from "../models/Vehicle.model";
import User from "../models/user.model";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      vehicleId,
      pickupLocation,
      dropLocation,
      pickupDate,
      pickupTime,
      tripType,
      returnDate,
      totalKm,
      totalAmount,
      specialInstruction,
    } = req.body;

    if (
      !userId ||
      !vehicleId ||
      !pickupLocation ||
      !dropLocation ||
      !pickupDate ||
      !pickupTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      isDeleted: false,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found.",
      });
    }

    if (!vehicle.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Vehicle is not available.",
      });
    }

    if (tripType === "Round Trip" && !returnDate) {
      return res.status(400).json({
        success: false,
        message: "Return Date is required.",
      });
    }

    const booking = await Booking.create({
      userId,
      vehicleId,
      pickupLocation,
      dropLocation,
      pickupDate,
      pickupTime,
      tripType,
      returnDate,
      totalKm,
      totalAmount,
      specialInstruction,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      data: booking,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({
      isDeleted: false,
    })
      .populate("userId")
      .populate({
        path: "vehicleId",
        populate: {
          path: "vehicleType",
        },
      })
      .populate("driverId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      isDeleted: false,
    })
      .populate("userId")
      .populate({
        path: "vehicleId",
        populate: {
          path: "vehicleType",
        },
      })
      .populate("driverId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (
      req.body.tripType === "Round Trip" &&
      !req.body.returnDate &&
      !booking.returnDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Return Date is required.",
      });
    }

    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("userId")
      .populate({
        path: "vehicleId",
        populate: {
          path: "vehicleType",
        },
      });

    res.status(200).json({
      success: true,
      message: "Booking updated successfully.",
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    booking.isDeleted = true;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};