import { Request, Response } from "express";
import notification from "../../models/notification/notificationModel";
import notificationTokenModel from "../../models/notification/notificationTokenModel";


export const notificationToken = async (req: Request, res: Response) => {
  const { user_id, notifyToken, socketId } = req.body;

  try {
    const notify = await notificationTokenModel.findOne({ user_id });

    if (notify) {
      const notifydoc = await notificationTokenModel.findByIdAndUpdate(
        notify._id,
        {
          token: notifyToken,
          socketID: socketId,
          isSignin: true,
        },
        { new: true }
      );

      return res.status(200).json({ token: notifydoc });
    }

    const notifytokens = await notificationTokenModel.create({
      user_id,
      token: notifyToken,
      socketID: socketId,
      isSignin: true,
    });

    return res.status(201).json({ token: notifytokens });

  } catch (error: any) {
    return res.status(400).json({
      message: "Something went wrong " + error.message,
    });
  }
};


export const checknotifytoken = async (
  req: Request,
  res: Response
) => {

  const { token, socketId, user_id } = req.body;

  try {

    const notifydoc = await notificationTokenModel.findOne({
      user_id,
      token,
      socketID: socketId,
    });


    if (!notifydoc) {
      return res.status(200).json({
        result: false,
      });
    }


    if (!notifydoc.isSignin) {
      await notificationTokenModel.findOneAndUpdate(
        { user_id },
        {
          isSignin: true,
        }
      );
    }


    return res.status(200).json({
      result: true,
    });


  } catch (error: any) {
    return res.status(400).json({
      message: "Something went wrong " + error.message,
    });
  }
};



export const getusernotification = async (
  req: Request,
  res: Response
) => {

  const { user_id, currentDate } = req.body;

  const resultsPerPage = 10;

  let page = Number(req.params.page) || 1;

  page = page - 1;


  try {

    const notificationdoc = await notification.findOne({
      user_id,
    });


    if (!notificationdoc) {
      return res.status(200).json({
        notifications: [],
      });
    }


    let notification_data = [
      ...notificationdoc.notifications,
    ].reverse();


    let count = notification_data.filter(
      (item:any)=> !item.seen
    ).length;


    const data_doc:any[] = [];


    for(
      let i = page * resultsPerPage;
      i < notification_data.length;
      i++
    ){

      if(
        new Date(notification_data[i].created_at) <
        new Date(currentDate)
      ){

        data_doc.push(notification_data[i]);
      }


      if(data_doc.length >= resultsPerPage){
        break;
      }
    }


    return res.status(200).json({
      message:"user notification fetch successfully",
      userNotification:data_doc,
      notifCount:notification_data.length,
      nsCount:count,
    });


  } catch(error:any){

    return res.status(500).json({
      message:"Something went wrong "+error.message,
    });

  }
};



export const updatenotificationseen = async (
  req:Request,
  res:Response
)=>{

  const { user_id, notifyIds } = req.body;


  try {


    await notification.updateOne(
      {user_id},
      {
        $set:{
          "notifications.$[elem].seen":true
        }
      },
      {
        arrayFilters:[
          {
            "elem._id":{
              $in:notifyIds
            }
          }
        ]
      }
    );


    return res.status(200).json({
      message:"Notification update",
    });


  }catch(error:any){

    return res.status(500).json({
      message:"Something went wrong "+error.message,
    });

  }
};



export const updatenotificationvisited = async (
  req:Request,
  res:Response
)=>{

  const {user_id, notify_id}=req.body;


  try{

    await notification.findOneAndUpdate(
      {
        user_id,
        "notifications._id":notify_id
      },
      {
        $set:{
          "notifications.$.visited":true
        }
      }
    );


    return res.status(200).json({
      message:"Notification update",
    });


  }catch(error:any){

    return res.status(500).json({
      message:"Something went wrong "+error.message,
    });

  }
};