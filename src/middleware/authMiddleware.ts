import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv'
dotenv.config();



const SECRET_KEY = process.env.DB_AUTH_SECRET;

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let newToken = ""
    if (req.session.token) {
      newToken = req.session.token
      console.log("auth");
    } else {
      console.log("token from headers")
      if (req.headers.authorization) {
        let objs = req.headers.authorization.replace("Bearer", "");
        // console.log("inside if________", objs);
        newToken = objs.trim()
      }

    }
    console.log("uuuuuuuu", newToken, SECRET_KEY)
    if (newToken && SECRET_KEY) {
      let user: any = jwt.verify(newToken, SECRET_KEY);
      console.log("verify - " + user?.email, user._id);
      req.user = user;
      console.log(req.user, "auth")
      if (user) {

        // let user_doc = await userModel.findOne({ email: user.email, token: newToken })
        // let user_doc_web = await userModel.findOne({ email: user.email, web_token:newToken })
        // if (user_doc || user_doc_web) {
        next();
      } else {
        res.status(400).json({ message: "Unauthorized access not allowed" })
      }

    } else {
      res.status(400).json({ message: "Unauthorized access not allowed" })
    }

  }
  //  else {
  //   res.status(400).json({ message: "Unauthorized access not allowed" })
  // }
  // }
  catch (error) {
    console.log(error);
    res.status(400).json({ message: "Unauthorized access not allowed" })
  }
}
export default authMiddleware
