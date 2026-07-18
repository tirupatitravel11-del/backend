import { Request, Response } from "express"
import userModel from "../models/user.model"
import { DateTime } from "luxon";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import MailSendCustomer from "../utils/MailSendCustomer";

export const forgetPassword = async (req: Request, res: Response) => {
    try {
        const { email, type = "" } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ 6 digit OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const secret = process.env.DB_AUTH_SECRET as string;

        const otpToken = jwt.sign({ code }, secret, { expiresIn: "2m" });

        await userModel.findByIdAndUpdate(user._id, {
            otp_token: otpToken,
            otp_attempts: 0,
            otp_verified: false,
            updated_at: DateTime.now().toUTC().toISO(),
        });

        // ✅ EMAIL (tumhara template)
        const sendMail = {
            from: `"Tirupati travels" <abhi.07on@gmail.com>`,
            to: email,
            subject: `TirupatiTravels - ${type === "resend" ? "Resend OTP" : "Forget Password"}`,
            template: "forgetPassword",
            context: {
                user_name: user.name,
                title: "Reset Password",
                content: "Use this OTP to reset your password",
                code,
            },
        };

        await MailSendCustomer(sendMail, "support");

        return res.status(200).json({
            message: "OTP sent successfully",
            email,
        });

    } catch (error: any) {
        return res.status(500).json({
            message: "Something went wrong: " + error.message,
        });
    }
};

export const verifyCode = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;

        const user: any = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const secret = process.env.DB_AUTH_SECRET as string;
        const MAX_ATTEMPTS = 3;

        try {
            const decoded: any = jwt.verify(user.otp_token, secret);

            // ❌ Wrong OTP
            if (decoded.code !== code) {
                const attempts = user.otp_attempts || 0;
                const newAttempts = attempts + 1;

                await userModel.findByIdAndUpdate(user._id, {
                    otp_attempts: newAttempts,
                });

                if (newAttempts >= MAX_ATTEMPTS) {
                    return res.status(400).json({
                        message: "Max attempts reached. Please resend OTP",
                    });
                }

                return res.status(400).json({
                    message: `Incorrect OTP. Attempts left: ${MAX_ATTEMPTS - newAttempts}`,
                });
            }

            // ✅ Correct OTP
            await userModel.findByIdAndUpdate(user._id, {
                otp_verified: true,
                otp_attempts: 0,
            });

            return res.status(200).json({
                message: "OTP verified successfully",
            });

        } catch (error: any) {
            if (error.name === "TokenExpiredError") {
                return res.status(400).json({
                    message: "OTP expired. Please resend OTP",
                });
            }

            return res.status(400).json({
                message: "Invalid OTP",
            });
        }

    } catch (error: any) {
        return res.status(500).json({
            message: "Something went wrong: " + error.message,
        });
    }
};
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id; // JWT middleware se aayega
    const { oldPassword, newPassword } = req.body;

    // ✅ Validation
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Old password and new password are required",
      });
    }

    // ✅ Find user
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ✅ Check old password
    const isMatch = await bcrypt.compare(oldPassword, user?.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Old password is incorrect",
      });
    }

    // ✅ Validate new password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase letters, and a number.",
      });
    }

    // ✅ Check same password
    const samePassword = await bcrypt.compare(newPassword, user?.password);

    if (samePassword) {
      return res.status(400).json({
        message: "New password cannot be same as old password",
      });
    }

    // ✅ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ✅ Update password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });

  } catch (err) {
    console.error("Error changing password:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, newPassword } = req.body;

        const user: any = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // 🔥 OTP verify check
        if (!user.otp_verified) {
            return res.status(400).json({
                message: "OTP not verified",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await userModel.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            otp_token: null,
            otp_verified: false,
            otp_attempts: 0,
        });

        return res.status(200).json({
            message: "Password reset successful",
        });

    } catch (error: any) {
        return res.status(500).json({
            message: "Something went wrong: " + error.message,
        });
    }
};

