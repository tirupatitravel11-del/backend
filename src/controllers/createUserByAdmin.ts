import { Request, Response } from "express";
import bcrypt from "bcrypt";
import userModel from "../models/user.model";
import roleModel from "../models/role.model";
import {
    generateRandomPassword,
  validateEmail,
  validateName,
} from "../utils/comman";
import jwt from "jsonwebtoken";

export const createUserByAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, gender, roleId } = req.body;

    // Required fields
    if (!name || !email || !gender || !roleId) {
      return res.status(400).json({
        success: false,
        message: "Name, Email, Gender and Role are required.",
      });
    }

    // Name Validation
    if (!validateName(name)) {
      return res.status(400).json({
        success: false,
        message: "Invalid name.",
      });
    }

    // Email Validation
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email.",
      });
    }

    // Gender Validation
    if (!["male", "female", "transgender"].includes(gender)) {
  return res.status(400).json({
    success: false,
    message: "Gender must be one of: male, female, or transgender.",
  });
    }
    // Check email already exists
    const existingUser = await userModel.findOne({
      email: email.toLowerCase(),
      isDeleted: false,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Check Role
    const role = await roleModel.findById(roleId);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Invalid role.",
      });
    }

    // Hash Password
     const plainPassword = generateRandomPassword(10);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);


    // Create User
    const user = await userModel.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      gender: gender.toLowerCase(),
      roleId: role?._id,
      created_by: req.user?._id, 
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        roleId: user.roleId,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const LoginForAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)
    // const date: any = getisotime(DateTime);
    let jwttoken = "";
    let secret = process.env.DB_AUTH_SECRET;

    if (!email) {
      return res.status(400).json({ message: "please enter registered email !!" });
    }
    if (!password) {
      return res.status(400).json({ message: "please enter password !!" });
    }

    const deleteduser = await userModel.findOne({ email, isDeleted: true });
    if (deleteduser) {
      return res.status(400).json({
        message: "Your account has been deleted. Please restore your account",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found please sign up !!" });
    }

    /** -----------------------------
     * ALLOW ONLY ADMIN TEACHER COUNSELOR USER TO LOGIN
     * --------------------------------**/

    const userRole = await roleModel.findById(user.roleId);

    if ((!userRole) || (userRole.name.toLowerCase() !== "counselor" && userRole.name.toLowerCase() !== "admin" && userRole.name.toLowerCase() !== "teacher"  && userRole.name.toLowerCase() !== "student")) {
      return res.status(403).json({ message: "Access denied! Only Admin and counselor and teacher can login" });
    }
    console.log(user, "role.....", userRole?.name)
    const isPasswordCorrect = await bcrypt.compare(password, String(user?.password));
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    // Generate JWT
    if (secret) {
      jwttoken = jwt.sign(
        { email, _id: user?._id, role: user?.roleId },
        secret,
        { expiresIn: "1d" }
      );
      req.session.token = jwttoken;
    }

    // Update login status
    const logedinuser = await userModel.findByIdAndUpdate(
      user?._id,
      { is_login: true, token: jwttoken, updated_by: user?._id },
      { new: true }
    ).populate({
      path: "roleId",
      populate: {
        path: "permissions",
        model: "permission",
      },
    });

    // const data = { ...logedinuser?._doc };
    if (!logedinuser) {
  return res.status(404).json({
    message: "User not found.",
  });
}

const data = logedinuser.toObject();

    return res.status(200).json({
      message: "login successful !!",
      userData: data,
      token: jwttoken,
    });

  } catch (error: any) {
    console.error("Error in controller:", error);
    return res.status(500).json({ message: "Something went wrong : " + error.message });
  }
};
export const signout = async (req: Request, res: Response) => {
  console.log("Signout called");
  try {
    const { userId } = req.body;
    // const date = getisotime(DateTime);

    // Session exist check
    if (!req.session) {
      res.status(400).json({ message: "No active session found" });
      return;
    }

    // Agar tum login ke waqt userId session me save karoge तो यहीं काम आसान हो जाएगा
    // login me add karo -> req.session.userId = user._id;
    // const userId = (req.session as any).userId;
    // console.log(userId, "userId");

    console.log("Signing out userId:", userId);
    if (userId) {
      await userModel.findByIdAndUpdate(
        userId,
        { is_login: false, token: "", updated_by: userId },
        { new: true }
      );
    }

    // if (userId) {
    //   await notificationTokenModel.findByIdAndUpdate(
    //     userId,
    //     { socketID:null, isSignin:false},
    //     { new: true }
    //   );
    // }

    // Destroy session from MongoStore
    const sid = req.sessionID; // current sessionId
    // console.log(sid, "sid");

    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        res.status(500).json({ message: "Logout failed" });
        return;
      }

      // force remove from store (safety net)
      if (sid) {
        req.sessionStore.destroy(sid, (err) => {
          if (err) console.error("Error removing session from store:", err);
        });
      }

      // Clear cookie also
      res.clearCookie("connect.sid", {
        path: "/", // same path as session
      });

      res.status(200).json({ message: "Logout successful!" });
      return;
    });
  } catch (error: any) {
    res.status(500).json({ message: "Something went wrong: " + error.message });
  }
};
