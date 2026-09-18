import mongoose from "mongoose";
import { Blog } from "../types/type";   
import { DateTime } from "luxon";

const blogPostSchema = new mongoose.Schema({
    title:{
        type:String        
    },
    content:{
        type:String
    },
    imageUrl:{
        type:String
    },
    created_at:{
        type:String,

    },
    updated_at:{
        type:String
    }, 
    created_by:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    updated_by:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "user"
    }       

});


blogPostSchema.pre("save", function setDatetime(next) {
    const currentDate = new Date().toISOString();
    this.created_at = currentDate;
    this.updated_at = currentDate;
    next();
}
)
const blogPostModel = mongoose.model<Blog>("blogpost", blogPostSchema);
export default blogPostModel;