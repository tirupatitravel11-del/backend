import mongoose from "mongoose";
import { NotificationToken } from "../../../types/type";

const notificationTokenSchema = new mongoose.Schema<NotificationToken>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    isSignin: {
      type: Boolean,
      default: true,
    },

    token: {
      type: String,
    },

    socketID: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const notificationTokenModel = mongoose.model<NotificationToken>(
  "notification_token",
  notificationTokenSchema
);

export default notificationTokenModel;


// import mongoose from 'mongoose'
// import { DateTime } from 'luxon';
// import { NotificationToken } from '../../../types/type';


// const notificationTokenSchema = new mongoose.Schema({

//     user_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "user"
//     },
//     isSignin: {
//         type: Boolean,
//         default:true
//     },
//     // isSignin_app:{
//     //     type: Boolean, 
//     //     default:true},
//     token: {
//         type: String
//     },
//     socketID: {
//         type: String
//     },
//     created_at: { type: Date },
//     updated_at: { type: Date },
// })


// const notificationTokenModel = mongoose.model<NotificationToken>("notification_token", notificationTokenSchema);
// export default notificationTokenModel