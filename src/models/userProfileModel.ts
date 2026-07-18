import mongoose, { Schema, Document } from "mongoose";

export interface IUserProfile extends Document {
  userId: mongoose.Types.ObjectId;



  city: string;
  state: string;
  country: string;
  address: string;
  pincode: string;

  photo: string;

  createdAt: Date;
  updatedAt: Date;
}

const userProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

  
    city: {
      type: String,
      trim: true,
      default: "",
    },

    state: {
      type: String,
      trim: true,
      default: "",
    },

    country: {
      type: String,
      trim: true,
      default: "India",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },



    photo: {
      type: String, // Cloudflare R2 / S3 / CDN URL
      default: "",
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

const UserProfile = mongoose.model<IUserProfile>(
  "UserProfile",
  userProfileSchema
);

export default UserProfile;