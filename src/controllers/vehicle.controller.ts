import { Request, Response } from "express";
import slugify from "slugify";
import VehicleModel from "../models/vehicle.model";
import CabTypeModel from "../models/vehicle.model";

export const createUpdateVehicle = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      id,
      name,
      brand,
      cab_type_id,
      description = "",
      image = "",
      passengerCapacity,
      luggageCapacity,
      airCondition = true,
      fuelType = "Petrol",
      transmission = "Manual",
      tags = [],
      sortOrder = 0,
      isPopular = false,
    } = req.body;

    const userId = req.user?._id;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Vehicle name is required.",
      });
    }

    if (!brand) {
      return res.status(400).json({
        success: false,
        message: "Brand is required.",
      });
    }

    if (!cab_type_id) {
      return res.status(400).json({
        success: false,
        message: "Cab type is required.",
      });
    }

    if (!passengerCapacity) {
      return res.status(400).json({
        success: false,
        message: "Passenger capacity is required.",
      });
    }

    if (luggageCapacity === undefined || luggageCapacity === null) {
      return res.status(400).json({
        success: false,
        message: "Luggage capacity is required.",
      });
    }

    // Check Cab Type
    const cabType = await CabTypeModel.findOne({
      _id: cab_type_id,
      isDeleted: false,
    });

    if (!cabType) {
      return res.status(404).json({
        success: false,
        message: "Cab type not found.",
      });
    }

    const slug = slugify(`${brand} ${name}`, {
      lower: true,
      strict: true,
      trim: true,
    });

    // ================= UPDATE =================

    if (id) {
      const vehicle = await VehicleModel.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: "Vehicle not found.",
        });
      }

      const duplicate = await VehicleModel.findOne({
        slug,
        isDeleted: false,
        _id: { $ne: id },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Vehicle already exists.",
        });
      }

      vehicle.name = name;
      vehicle.brand = brand;
      vehicle.slug = slug;
      vehicle.cab_type_id = cab_type_id;
      vehicle.description = description;
      vehicle.image = image;
      vehicle.passengerCapacity = passengerCapacity;
      vehicle.luggageCapacity = luggageCapacity;
      vehicle.airCondition = airCondition;
      vehicle.fuelType = fuelType;
      vehicle.transmission = transmission;
      vehicle.tags = tags;
      vehicle.sortOrder = sortOrder;
      vehicle.isPopular = isPopular;
      vehicle.updated_by = userId;

      await vehicle.save();

      return res.status(200).json({
        success: true,
        message: "Vehicle updated successfully.",
        data: vehicle,
      });
    }

    // ================= CREATE =================

    const duplicate = await VehicleModel.findOne({
      slug,
      isDeleted: false,
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Vehicle already exists.",
      });
    }

    const vehicle = await VehicleModel.create({
      name,
      brand,
      slug,
      cab_type_id,
      description,
      image,
      passengerCapacity,
      luggageCapacity,
      airCondition,
      fuelType,
      transmission,
      tags,
      sortOrder,
      isPopular,
      created_by: userId,
      updated_by: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully.",
      data: vehicle,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


export const getAllVehicle = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      cab_type_id,
      isActive,
      isDeleted,
    } = req.body;

    const filter: any = {};

    if (cab_type_id) {
      filter.cab_type_id = cab_type_id;
    }

    if (typeof isActive === "boolean") {
      filter.isActive = isActive;
    }

    if (typeof isDeleted === "boolean") {
      filter.isDeleted = isDeleted;
    }

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          tags: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const total = await VehicleModel.countDocuments(filter);

    const vehicles = await VehicleModel.find(filter)
      .populate("cab_type_id", "name slug")
      .sort({
        sortOrder: 1,
        created_at: -1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Vehicle list fetched successfully.",
      data: vehicles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


export const getSingleVehicle = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Vehicle id is required.",
      });
    }

    const vehicle = await VehicleModel.findById(id)
      .populate("cab_type_id", "name slug");

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle fetched successfully.",
      data: vehicle,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};



export const deleteVehicle = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Vehicle id is required.",
      });
    }

    const vehicle = await VehicleModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found.",
      });
    }

    vehicle.isDeleted = true;
    vehicle.updated_by = req.user?._id;

    await vehicle.save();

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully.",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};




export const restoreVehicle = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Vehicle id is required.",
      });
    }

    const vehicle = await VehicleModel.findOne({
      _id: id,
      isDeleted: true,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found.",
      });
    }

    vehicle.isDeleted = false;
    vehicle.updated_by = req.user?._id;

    await vehicle.save();

    return res.status(200).json({
      success: true,
      message: "Vehicle restored successfully.",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const changeVehicleStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id, isActive } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Vehicle id is required.",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be boolean.",
      });
    }

    const vehicle = await VehicleModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found.",
      });
    }

    vehicle.isActive = isActive;
    vehicle.updated_by = req.user?._id;

    await vehicle.save();

    return res.status(200).json({
      success: true,
      message: `Vehicle ${
        isActive ? "activated" : "deactivated"
      } successfully.`,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};




export const getVehicleDropdown = async (
  req: Request,
  res: Response
) => {
  try {
    const { cab_type_id } = req.body;

    const filter: any = {
      isActive: true,
      isDeleted: false,
    };

    if (cab_type_id) {
      filter.cab_type_id = cab_type_id;
    }

    const vehicles = await VehicleModel.find(filter)
      .select("_id name brand cab_type_id")
      .populate("cab_type_id", "name")
      .sort({
        sortOrder: 1,
        name: 1,
      });

    return res.status(200).json({
      success: true,
      message: "Vehicle dropdown fetched successfully.",
      data: vehicles,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};