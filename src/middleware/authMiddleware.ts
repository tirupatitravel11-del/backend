import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.DB_AUTH_SECRET;

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let newToken = "";
    if (req.session.token) {
      newToken = req.session.token;

    } else {
      if (req.headers.authorization) {
        let objs = req.headers.authorization.replace("Bearer", "");
        newToken = objs.trim();
      }
    }
    if (newToken && SECRET_KEY) {
      let user: any = jwt.verify(newToken, SECRET_KEY);
      req.user = user;
      if (user) {
        // let user_doc = await userModel.findOne({ email: user.email, token: newToken })
        // let user_doc_web = await userModel.findOne({ email: user.email, web_token:newToken })
        // if (user_doc || user_doc_web) {

        next();
      } else {
        res.status(400).json({ message: "Unauthorized access not allowed" });
      }
    } else {
      res.status(400).json({ message: "Unauthorized access not allowed" });
    }
  } catch (error) {
    //  else {
    //   res.status(400).json({ message: "Unauthorized access not allowed" })
    // }
    // }
    console.log(error);
    res.status(400).json({ message: "Unauthorized access not allowed" });
  }
};
export default authMiddleware;
