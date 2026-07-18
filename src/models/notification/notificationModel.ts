import mongoose from "mongoose";
import { Notification } from "../../types/type";


const notificationItemSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
    },

    data: {
      section: {
        type: String,
      },
      data_id: {
        type: String,
      },
    },

    title: {
      type: String,
    },

    body: {
      type: String,
    },

    url: {
      type: String,
    },

    visited: {
      type: Boolean,
      default: false,
    },

    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);


const notificationSchema = new mongoose.Schema<Notification>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    imported: {
      type: Boolean,
      default: false,
    },

    notifications: [notificationItemSchema],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);


const notificationModel = mongoose.model<Notification>(
  "notification",
  notificationSchema
);

export default notificationModel;
// import mongoose from 'mongoose'
// // import { DateTime } from 'luxon';
// import { Notification } from '../../../types/type';


// const notificationSchema = new mongoose.Schema({

//     user_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//     },
//     // imported: {
//     //     type: Boolean,
//     //     default:false
//     // },
//     notifications: [{
//         // data:{section:String,data_id:String},
//         user_id: { type: String },
//         title: { type: String },
//         body: { type: String },
//         url: { type: String },
//         visited: { type: Boolean, default: false },
//         seen: { type: Boolean, default: false },
//         created_at: { type: Date },
//         updated_at: { type: Date },
//     }],
//     created_at: { type: Date },
//     updated_at: { type: Date },
// })



// const notificationModel = mongoose.model<Notification>("notification", notificationSchema);
// export default notificationModel