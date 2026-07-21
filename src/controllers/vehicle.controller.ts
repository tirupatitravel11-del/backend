import { Request, Response } from "express";
import Vehicle from "../models/Vehicle.model";
import VehicleType from "../models/vehicleType.model";

// Create Vehicle
export const createVehicle = async (req: Request, res: Response) => {
  try {
    const {
      vehicleType,
      vehicleName,
      brand,
      model,
      registrationNumber,
      fuelType,
      transmission,
      seatCapacity,
      luggageCapacity,
      pricePerKm,
      baseFare,
      images,
      isAvailable,
    } = req.body;

    if (!vehicleType || !vehicleName) {
      return res.status(400).json({
        success: false,
        message: "Vehicle Type and Vehicle Name are required.",
      });
    }

    const vehicleTypeExists = await VehicleType.findOne({
      _id: vehicleType,
      isDeleted: false,
    });

    if (!vehicleTypeExists) {
      return res.status(404).json({
        success: false,
        message: "Vehicle Type not found.",
      });
    }

    if (registrationNumber) {
      const alreadyExists = await Vehicle.findOne({
        registrationNumber,
        isDeleted: false,
      });

      if (alreadyExists) {
        return res.status(400).json({
          success: false,
          message: "Registration Number already exists.",
        });
      }
    }

    const vehicle = await Vehicle.create({
      vehicleType,
      vehicleName,
      brand,
      model,
      registrationNumber,
      fuelType,
      transmission,
      seatCapacity,
      luggageCapacity,
      pricePerKm,
      baseFare,
      images,
      isAvailable,
    });

    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully.",
      data: vehicle,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Vehicles
export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find({
      isDeleted: false,
    })
      .populate("vehicleType")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Vehicle By Id
export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("vehicleType");

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Vehicle
export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const vehicle = await Vehicle.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found.",
      });
    }

    if (req.body.vehicleType) {
      const typeExists = await VehicleType.findOne({
        _id: req.body.vehicleType,
        isDeleted: false,
      });

      if (!typeExists) {
        return res.status(404).json({
          success: false,
          message: "Vehicle Type not found.",
        });
      }
    }

    if (req.body.registrationNumber) {
      const duplicate = await Vehicle.findOne({
        registrationNumber: req.body.registrationNumber,
        _id: { $ne: id },
        isDeleted: false,
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Registration Number already exists.",
        });
      }
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).populate("vehicleType");

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully.",
      data: updatedVehicle,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Vehicle (Soft Delete)
export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found.",
      });
    }

    vehicle.isDeleted = true;
    await vehicle.save();

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully.",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};