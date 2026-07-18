
import mongoose from 'mongoose'
import { StatusType } from '../types/type';
const statusTypeSchema = new mongoose.Schema<StatusType>({
    status_type:{
        type:String
    },
    status_type_id:{
        type:Number,
    },

    // created_at:{
    //     type:String,
    // },
    // updated_at:{
    //     type:String,
    // },
    created_by:{ type:mongoose.Schema.Types.ObjectId,  ref:'User' },
    updated_by:{ type:mongoose.Schema.Types.ObjectId, ref:'User' },
},{
timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
},
});

// statusTypeSchema.pre('save', function(next){
//     this.created_at = DateTime.now().toUTC().toISO();
//     this.updated_at = DateTime.now().toUTC().toISO();
//     next();
// })

const statusTypeModel = mongoose.model<StatusType>('status_type', statusTypeSchema);
export default statusTypeModel;