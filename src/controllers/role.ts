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
    console.log("Permissions received:", permissions);  
    if (!name || !Array.isArray(permissions)) {
      res.status(400).json({ error: "Name and permissions are required." });
      return
    }

    if (id) {

      //  Update role if ID exists
      const updatedRole = await roleModel.findByIdAndUpdate(
        id,
        {
          $set: { name: name, updated_at: new Date().toISOString(), permissions: permissions  },
          // $addToSet: { permissions: { $each: permissions } }, // adds only new values
        },
        { new: true }
      );

      if (!updatedRole) {
        res.status(404).json({ error: "Role not found." });
        return
      }

      res.status(200).json({
        message: "Role updated successfully.",
        data: updatedRole,
      });
      return
    } else {
      //  Create new role
      const existingRole = await roleModel.findOne({ name });
      if (existingRole) {
        res.status(409).json({ error: "Role with this name already exists." });
        return
      }

      const newRole = new roleModel({
        name,
        permissions,
        created_at: new Date().toISOString(),
      });

      await newRole.save();

      res.status(201).json({
        message: "Role created successfully.",
        data: newRole,
      });
      return
    }
  } catch (error) {
    console.error("Create/Update Role Error:", error);
    res.status(500).json({ error: "Internal server error." });
    next(error);
    return
  }
};
export const getRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roles = await roleModel.find();
    return res.status(200).json({ message: "roles fetch successfully.", data: roles });
    
  } catch (error) {
    console.error("fetch all Role  Error:", error);
    res.status(500).json({ error: "Internal server error." });
    next(error);
    return
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