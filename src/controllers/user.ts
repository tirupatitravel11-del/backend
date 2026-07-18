import { Request, Response,NextFunction } from "express";
import bcrypt from "bcrypt";
import userModel from "../models/user.model";
import roleModel from "../models/role.model";
import {
    generateRandomPassword,
  validateEmail,
  validateName,
} from "../utils/comman";
import mongoose from "mongoose";
import UserProfile from "../models/userProfileModel";
import jwt from "jsonwebtoken";

export const userLogin = async (req: Request, res: Response) => {
    let secret = process.env.DB_AUTH_SECRET
    try {
        let { email, password } = req.body
        // const date = getisotime(DateTime);

        if (!email && !password) {
            return res.status(500).json({ message: "all fields are required" })
        }


        const deleteduser = await userModel.findOne({ email, isDeleted: true });
        if (deleteduser) {
            return res.status(400).json({ message: "Seems like your account has been deleted.please restore your account", });
        }
        let user = await userModel.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }


        const isPassowordCorrect = await bcrypt.compare(password, String(user?.password));
        if (!isPassowordCorrect) {
            return res.status(400).json({ message: "Invalid password!" });
        }

        let token
        if (secret) {
            token = jwt.sign({ email, _id: user?._id, role: user?.roleId }, secret, {
                expiresIn: "1d",
            });

            req.session.token = token;
        }

        let loggedinuser;

        loggedinuser = await userModel.findByIdAndUpdate(user?._id, { is_login: true, updated_by: user?._id },
            { new: true }).populate("roleId").select({ password: 0 });

        // const data = { ...logedinuser?._doc };

        return res.status(200).json({
            message: "Signin successfully !! ",
            userData: loggedinuser,
            token: token,
        });


    } catch (error: any) {
        return res.status(500).json({ message: "Something went wrong : " + error?.message });
    }
}


export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      search,
      roleId,
      roleName,
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
      is_login,
      gender,
      city,
    } = req.body || {};


    const query: any = {};

    //  Search by name or email
    if (search) {
      query.$or = [
        { name: new RegExp(search as string, "i") },
        { email: new RegExp(search as string, "i") },
      ];
    }

    //  Filters
    let finalRoleId = roleId;
    if (roleName) {
      const roleFromName = await roleModel.findOne({ name: roleName });
      console.log(roleFromName, "ssss");

      if (!roleFromName) {
        return res.status(400).json({ message: "Invalid roleName" });
      }
      finalRoleId = roleFromName._id;
    }
    if (finalRoleId) {
      query.roleId = finalRoleId;
    }
    if (is_login !== undefined) query.is_login = is_login === "true";
    if (gender) query.gender = gender;
    if (city) query.city = new RegExp(city as string, "i");

    const skip = (Number(page) - 1) * Number(limit);

    const total = await userModel.countDocuments(query);

    const users = await userModel
      .find(query).select("-password")
      // .select("-password")
      .populate("roleId")
      .skip(skip)
      .limit(Number(limit))
      .sort({ [sort as string]: order === "asc" ? 1 : -1 });

    res.status(200).json({
      message: "Users fetched successfully.",
      total,
      page: Number(page),
      limit: Number(limit),
      data: users,
    });
    return
  } catch (error) {
    console.error("Get All Users Error:", error);
    next(error);
    res.status(500).json({ message: "Internal server error." });
    return
  }
};

export const getSingleUser = async (
  req: Request,
  res: Response,
) => {
  try {
    // const {id } = req.body;
    // console.log(id,  "singleuser")

    // if (!id) {
    //   res.status(400).json({ message: "User ID is required." });
    //   return
    // }
    const userId = req?.user?._id

    const user = await userModel.findById(userId).populate({
      path: "roleId", populate: {
        path: "permissions",
        model: "permission"
      }
    });
    // console.log(user, "userdetails")

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const userprofile = await UserProfile.findOne({ userId: user?._id }).select("-password")

    return res.status(200).json({
      message: "User fetched successfully.",
      result: user,
      userprofile
    });

  } catch (error) {
    console.error("Get Single User Error:", error);
    // next(error);
    res.status(500).json({ message: "Internal server error." });
    return
  }
};
export const getUserByRole = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      rolename,
      search = "",
      order = { col: "created_at", order: -1 },
    } = req.body;

    const skip = (Number(page) - 1) * Number(limit);

    const userRole = await roleModel.findOne({ name: rolename });

    if (!userRole) {
      return res.status(400).json({
        success: false,
        message: "Role does not exist.",
      });
    }

    const filter: any = {
      roleId: new mongoose.Types.ObjectId(userRole._id),
    };

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const result = await userModel.aggregate([
      {
        $match: filter,
      },

      {
        $lookup: {
          from: "userprofiles",
          localField: "_id",
          foreignField: "userId",
          as: "profile",
        },
      },

      {
        $unwind: {
          path: "$profile",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $sort: {
          [order.col]: order.order,
        },
      },

      {
        $skip: skip,
      },

      {
        $limit: Number(limit),
      },

      {
        $project: {
          password: 0,
          __v: 0,
        },
      },
    ]);

    const totalCount = await userModel.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      result,
      count: totalCount,
      page: Number(page),
      totalPages: Math.ceil(totalCount / Number(limit)),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};