import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URL = (process.env.SERVER_TYPE === "staging") ? process.env.STAGING_MONGODB_URL : process.env.MONGODB_URL

const connectDB = async () => {
    try {
        if(MONGODB_URL){
        await mongoose.connect(MONGODB_URL)
        console.log("MongoDB connected");
        }
    } catch (error) {
        console.log("Not Connected", error);
    }
}

export default connectDB