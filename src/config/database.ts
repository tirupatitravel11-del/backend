import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URL = (process.env.SERVER_TYPE === "staging") ? process.env.STAGING_MONGODB_URL : process.env.MONGODB_URL
console.log(MONGODB_URL);

console.log("SERVER_TYPE:", process.env.SERVER_TYPE);
console.log("DB URL:", MONGODB_URL);
const connectDB = async () => {
    try {
        if(MONGODB_URL){
            console.log(MONGODB_URL);
            
        await mongoose.connect(MONGODB_URL)
        console.log("MongoDB connected");
        }
    } catch (error) {
        console.log("Not Connected", error);
    }
}

export default connectDB