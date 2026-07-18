import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { Role } from "../types/type"; 

const checkPermission = (permissionName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
const user = await User.findById(req.user?._id).populate({
        path: "roleId",
        populate: {
          path: "permissions",
          model: "Permission", // model name capitalized
        },
      });

      if (!user || user.isDeleted) {
        return res.status(403).json({ message: "Access denied" });
      }

      const role = user.roleId as unknown as Role;

      if (!role || !role.permissions) {
        return res.status(403).json({ message: "No role/permissions found" });
      }

      const hasPermission = role.permissions.some(
        (p: any) => p.name === permissionName
      );

      if (!hasPermission) {
        return res.status(403).json({ message: "Permission denied" });
      }

      next();
    } catch (err) {
      console.error("Permission Check Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};

export default checkPermission;