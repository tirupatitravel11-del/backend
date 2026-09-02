// import mongoose from "mongoose";
// import dotenv from 'dotenv';

// dotenv.config();

// const MONGODB_URL = (process.env.SERVER_TYPE === "staging") ? process.env.STAGING_MONGODB_URL : process.env.MONGODB_URL

// const connectDB = async () => {
//     try {
//         if(MONGODB_URL){
//         await mongoose.connect(MONGODB_URL)
//         console.log(MONGODB_URL,"MongoDB connected");
//             console.log("SERVER_TYPE =", process.env.SERVER_TYPE);
//     console.log("MONGODB_URL exists =", !!MONGODB_URL);
//         }
//     } catch (error) {
//         console.log("Not Connected", error);
//     }
// }

// export default connectDB

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const MONGODB_URL =
      process.env.SERVER_TYPE === "staging"
        ? process.env.STAGING_MONGODB_URL
        : process.env.MONGODB_URL;

    console.log("SERVER_TYPE =", process.env.SERVER_TYPE);
    console.log("MONGODB_URL exists =", !!MONGODB_URL);

    if (!MONGODB_URL) {
      throw new Error("MONGODB_URL is missing");
    }

    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
      return;
    }

    await mongoose.connect(MONGODB_URL);

    console.log(
      "✅ MongoDB connected:",
      mongoose.connection.host
    );
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
};

export default connectDB;