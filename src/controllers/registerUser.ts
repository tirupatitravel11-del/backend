import { Request, Response } from "express";
import bcrypt from "bcrypt";
import userModel from "../models/user.model";
import roleModel from "../models/role.model";
import { validateEmail, validateName, validatePassword } from "../utils/comman";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password,gender } = req.body;

    // Validation
    if (!name || !email || !password || !gender) {
      return res.status(400).json({
        success: false,
        message: "Name, Email, Gender and Password are required.",
      });
    }
if (!validateName(name)) {
  return res.status(400).json({
    success: false,
    message: "Please enter a valid name.",
  });
}
if (!validateEmail(email)) {
    return res.status(400).json({
        success: false,
        message: "Invalid email address."
    });
}
if (!validatePassword(password)) {
    return res.status(400).json({
        success: false,
        message: "Invalid password."
    });
}

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
        message: "Email already registered.",
      });
    }

    // Get Customer Role
    const role = await roleModel.findOne({ name: "customer" });

    if (!role) {
      return res.status(500).json({
        success: false,
        message: "Customer role not found.",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await userModel.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      gender,
      roleId: role._id,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        gender:gender
      },
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};