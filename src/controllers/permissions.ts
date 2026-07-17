import { NextFunction, Request, Response } from "express";
import permissionModel from "../models/permission.model";


export const createPermission = async (req: Request, res: Response,next: NextFunction) => {
    try {
    const { id, name, label } = req.body;

    //  Validation
    if (!name || !label) {
       res.status(400).json({ error: "Name and Label are required." });
       return
    }

    //  Update Existing Permission
    if (id) {
      // Check if same name already exists in another record
      const duplicate = await permissionModel.findOne({ name, _id: { $ne: id } });
      if (duplicate) {
         res.status(409).json({ error: "Another permission with this name already exists." });
         return
      }

      const updatedPermission = await permissionModel.findByIdAndUpdate(
        id,
        {
          name,
          label,
          updated_at: new Date().toISOString(),
        },
        { new: true }
      );

      if (!updatedPermission) {
         return res.status(404).json({ error: "Permission not found." });
         
      }

      return res.status(200).json({
        message: "Permission updated successfully.",
        data: updatedPermission,
      });
      
    }

    //  Create New Permission
    const existingPermission = await permissionModel.findOne({ name });
    if (existingPermission) {
       return res.status(409).json({ error: "Permission with this name already exists." });
       
    }

    const newPermission = new permissionModel({
      name,
      label,
      created_at: new Date().toISOString(),
    });

    await newPermission.save();

     return res.status(201).json({
      message: "Permission created successfully.",
      data: newPermission,
    });
    

  } catch (error) {
    console.error("Create/Update Permission Error:", error);
    next(error);
     res.status(500).json({ error: "Internal server error." });
     return
  }
};
export const getAllPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //  const skip = (page - 1) * limit;

    const data = await permissionModel.find().sort({"created_at":-1}).limit(10);
    res.status(200).json({ message: "Permissions fetch successfully.", data: data });
    return
  } catch (error) {
    console.error("fetch all permissions  Error:", error);
    res.status(500).json({ error: "Internal server error." });
    next(error);
    return
  }
};
export const deletePermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.body;

    if (!id) {
       res.status(400).json({ error: "Permission ID is required." });
       return
    }

    const deletedPermission = await permissionModel.findByIdAndDelete(id);

    if (!deletedPermission) {
       res.status(404).json({ error: "Permission not found." });
       return
    }

    res.status(200).json({
      message: "Permission deleted successfully.",
      data: deletedPermission,
    });
    return
  } catch (error) {
    console.error("Delete Permission Error:", error);
    res.status(500).json({ error: "Internal server error." });
    next(error);
    return
  }
};
export const getPermissionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
       res.status(400).json({ error: "Permission ID is required." });
       return
    }

    const permission = await permissionModel.findById(id);

    if (!permission) {
       res.status(404).json({ error: "Permission not found." });
       return
    }

     res.status(200).json({
      message: "Permission fetched successfully.",
      data: permission,
    });
    return
  } catch (error) {
    console.error("Get Permission By ID Error:", error);
    // next(error); // optional, in case you use centralized error handling
     res.status(500).json({ error: "Internal server error." });
     return
  }
};