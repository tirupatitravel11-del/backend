import { Request, Response } from "express";
import VehicleType from "../models/vehicleType.model";


// Create Vehicle Type
export const createVehicleType = async (req: Request, res: Response) => {
    try {

        const { typeName, description } = req.body;

        if (!typeName) {
            return res.status(400).json({
                success: false,
                message: "Vehicle type name is required"
            });
        }

        const alreadyExists = await VehicleType.findOne({
            typeName,
            isDeleted: false
        });

        if (alreadyExists) {
            return res.status(400).json({
                success: false,
                message: "Vehicle type already exists"
            });
        }

        const vehicleType = await VehicleType.create({
            typeName,
            description
        });

        return res.status(201).json({
            success: true,
            message: "Vehicle type created successfully",
            data: vehicleType
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get All
export const getAllVehicleTypes = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      order = { col: "created_at", order: -1 },
    } = req.body;

    // Pagination
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    let sortObj: any = { created_at: -1 };

    if (order?.col && order?.order !== undefined) {
      sortObj = {
        [order.col]: Number(order.order) === 1 ? 1 : -1,
      };
    }

    // Filter
    const filter: any = {
      isDeleted: false,
    };

    // Search
    if (search && search.trim() !== "") {
      filter.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    // Fetch Data
    const data = await VehicleType.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    // Total Count
    const count = await VehicleType.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Vehicle types fetched successfully.",
      data,
      count,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(count / limitNum),
    });
  } catch (error: any) {
    console.error("Get Vehicle Types Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get Single
export const getVehicleTypeById = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const data = await VehicleType.findOne({
            _id: id,
            isDeleted: false
        });

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Vehicle type not found"
            });
        }

        return res.status(200).json({
            success: true,
            data
        });

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// Update
export const updateVehicleType = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const { typeName, description, isActive } = req.body;

        const exists = await VehicleType.findOne({
            _id: id,
            isDeleted: false
        });

        if (!exists) {
            return res.status(404).json({
                success: false,
                message: "Vehicle type not found"
            });
        }

        if (typeName) {

            const duplicate = await VehicleType.findOne({
                _id: { $ne: id },
                typeName,
                isDeleted: false
            });

            if (duplicate) {
                return res.status(400).json({
                    success: false,
                    message: "Vehicle type already exists"
                });
            }

        }

        const updated = await VehicleType.findByIdAndUpdate(
            id,
            {
                typeName,
                description,
                isActive
            },
            {
                new: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Vehicle type updated successfully",
            data: updated
        });

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// Delete (Soft Delete)
export const deleteVehicleType = async (req: Request, res: Response) => {

    try {

        const { id } = req.body;

        const exists = await VehicleType.findOne({
            _id: id,
            isDeleted: false
        });

        if (!exists) {
            return res.status(404).json({
                success: false,
                message: "Vehicle type not found"
            });
        }

        await VehicleType.findByIdAndUpdate(id, {
            isDeleted: true
        });

        return res.status(200).json({
            success: true,
            message: "Vehicle type deleted successfully"
        });

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
export const restoreVehicleType = async (req: Request, res: Response) => {

    try {

        const { id } = req.body;

        const exists = await VehicleType.findOne({
            _id: id,
            isDeleted: true
        });

        if (!exists) {
            return res.status(404).json({
                success: false,
                message: "Vehicle type not found"
            });
        }

        await VehicleType.findByIdAndUpdate(id, {
            isDeleted: false
        });

        return res.status(200).json({
            success: true,
            message: "Vehicle type restroe successfully"
        });

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};