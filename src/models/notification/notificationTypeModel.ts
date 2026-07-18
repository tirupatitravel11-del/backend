
import mongoose from "mongoose";
import { NotificationType } from "../../types/type";

const notificationTypeSchema = new mongoose.Schema<NotificationType>(
  {
    notify_type_id: {
      type: Number,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const notificationTypeModel = mongoose.model<NotificationType>(
  "notification_type",
  notificationTypeSchema
);

export default notificationTypeModel;


// import mongoose from 'mongoose'
// import { DateTime } from 'luxon';
// import { NotificationType } from '../../../types/type';


// const notificationTypeSchema = new mongoose.Schema({
    
//   {  notify_type_id:{
//         type:Number
//     },
//     name:{
//         type:String
//     },
// },
//     {
// timestamps: {
//     createdAt: "created_at",
//     updatedAt: "updated_at",
// },
// })


// const notificationTypeModel = mongoose.model<NotificationType>("notification_type", notificationTypeSchema);
// export default notificationTypeModel