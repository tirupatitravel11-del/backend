import { DateTime } from "luxon";
// import { getisotime } from "../utils/common";
// import { getUserModel } from "../models/user.model";
// import { getNotificationTokenModel } from "../models/notificationtoken.model";


export const socketHandler = async (socket: any) => {


    // let date = getisotime(DateTime)

    socket.on("user_online", async (data:any) => {
        // const userModel = getUserModel(data.tenantId)
        // const notificationTokenModel = getNotificationTokenModel(data.tenantId)
        // let check = await notificationTokenModel.findOne({ user_id: data.user_id });

        // if (check) {
            // await userModel.findByIdAndUpdate(data.user_id, { socketID: socket.id },{new:true})
            // await notificationTokenModel.findOneAndUpdate({ user_id: data.user_id }, { socketID: socket.id, isSignin: true, updated_at: date }, { new: true });

        // } else {
            // await notificationTokenModel.create({
            //     user_id: data.user_id,
            //     token: "",
            //     socketID: socket.id
            // });
        // }
    });

    socket.on('disconnect', async() => {
        console.log('user disconnected');
    });
}

export default socketHandler