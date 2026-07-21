import { NextFunction, Request, Response } from "express";
import roleModel from "../models/role.model";
import mongoose from "mongoose";
import userModel from "../models/user.model";
export const createRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, name, permissions } = req.body;

    if (!name || !Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        message: "Name and permissions are required.",
      });
    }

    // ================= UPDATE ROLE =================
    if (id) {
      const existingRole = await roleModel.findOne({
        _id: { $ne: id },
        name,
        isDeleted: false,
      });

      if (existingRole) {
        return res.status(409).json({
          success: false,
          message: "Role name already exists.",
        });
      }

      const updatedRole = await roleModel.findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
          name,
          permissions,
          updated_by: req.user?._id, // Auth middleware
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate("permissions");

      if (!updatedRole) {
        return res.status(404).json({
          success: false,
          message: "Role not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Role updated successfully.",
        data: updatedRole,
      });
    }

    // ================= CREATE ROLE =================
    const existingRole = await roleModel.findOne({
      name,
      isDeleted: false,
    });

    if (existingRole) {
      return res.status(409).json({
        success: false,
        message: "Role already exists.",
      });
    }

    const newRole = await roleModel.create({
      name,
      permissions,
      created_by: req.user?._id, // Auth middleware
    });

    const role = await roleModel
      .findById(newRole._id)
      .populate("permissions");

    return res.status(201).json({
      success: true,
      message: "Role created successfully.",
      data: role,
    });
  } catch (error) {
    next(error);
  }
};
export const getRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roles = await roleModel
      .find({ isDeleted: false })
      .populate("permissions")
      .sort({ created_at: -1 });

    return res.status(200).json({
      success: true,
      message: "Roles fetched successfully.",
      data: roles,
    });
  } catch (error) {
    console.error("Fetch Roles Error:", error);
    next(error);
  }
};
export const deleteRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.body;

    if (!id) {
      res.status(400).json({ error: "Role ID is required." });
      return
    }

    const deletedRole = await roleModel.findByIdAndDelete(id);

    if (!deletedRole) {
      res.status(404).json({ error: "Role not found." });
      return
    }

    res.status(200).json({
      message: "Role deleted successfully.",
      data: deletedRole,
    });
    return
  } catch (error) {
    console.error("Delete Role Error:", error);
    res.status(500).json({ error: "Internal server error." });
    next(error);
    return
  }
};
export const softDeleteRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Role ID is required.",
      });
    }

    const role = await roleModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found.",
      });
    }

    role.isDeleted = true;
    role.deleted_at = new Date();
    role.deleted_by = req.user?._id; 

    await role.save();

    return res.status(200).json({
      success: true,
      message: "Role deleted successfully.",
      data: role,
    });
  } catch (error) {
    console.error("Delete Role Error:", error);
    next(error);
  }
};
export const getRoleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Role ID is required." });
      return
    }

    const role = await roleModel.findById(id);

    if (!role) {
      res.status(404).json({ error: "Role not found." });
      return
    }

    res.status(200).json({
      message: "Role fetched successfully.",
      data: role,
    });
    return
  } catch (error) {
    console.error("Get Role By ID Error:", error);
    // next(error); // optional, in case you use centralized error handling
    res.status(500).json({ error: "Internal server error." });
    return
  }
};
export const deleteRolePermission = async (req: Request, res: Response) => {
  try {
    const { id, roleId } = req.body
    const roledata = await roleModel.findById(roleId)
    if (!roledata) {
      return res.status(400).json({ message: "Role does not exists" })
    }

    let result = await roleModel.findByIdAndUpdate(
      roleId,
      { $pull: { permissions: id } }, // removes permission with matching _id
      { new: true } // return updated doc
    );

    res.status(200).json({ message: "permission deleted successfully", result })

  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
}

export const getCounsellors = async(req:Request, res:Response) => {
try {
    const result = await userModel.aggregate([
      {
        $lookup: {
          from: "roles",
          localField: "roleId",
          foreignField: "_id",
          as: "roleId",
        },
      },
      { $unwind: "$roleId" },
      {
        $match:{
          "roleId.name":"counselor"
        }
      }
    ])
    console.log(result, "roles")
    return res.status(200).json({message:"Counsellor fetched successfully", result})
} catch (error) {
  return res.status(500).json({message:"error in fetching user"})
}
}