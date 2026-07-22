import { Request, Response } from "express";
import slugify from "slugify";
import StateModel from "../../models/state/state.model";

export const createUpdateState = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            id,
            name,
            code="",
            description=""
        } = req.body;

        const userId = req.user?._id;

        if (!name) {
            return res.status(400).json({
                error:"State name is required."
            });
        }

        const slug = slugify(name,{
            lower:true,
            strict:true,
            trim:true
        });

        if(id){

            const state = await StateModel.findById(id);

            if(!state){
                return res.status(404).json({
                    error:"State not found."
                });
            }

            const duplicate = await StateModel.findOne({
                slug,
                _id:{
                    $ne:id
                },
                status:13
            });

            if(duplicate){
                return res.status(400).json({
                    error:"State already exists."
                });
            }

            state.name=name;
            state.slug=slug;
            state.code=code;
            state.description=description;
            state.updated_by=userId;

            await state.save();

            return res.status(200).json({
                message:"State updated successfully.",
                data:state
            });

        }

        const duplicate = await StateModel.findOne({
            slug,
            status:13
        });

        if(duplicate){
            return res.status(400).json({
                error:"State already exists."
            });
        }

        const newState = await StateModel.create({

            name,

            slug,

            code,

            description,

            created_by:userId,

            updated_by:userId

        });

        return res.status(201).json({

            message:"State created successfully.",

            data:newState

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            error:"Internal server error."
        });

    }

}

export const getAllState = async (
    req: Request,
    res: Response
) => {

    try{

        const {

            page=1,

            limit=10,

            search=""

        }=req.body;

        const skip=(page-1)*limit;

        const filter:any={

            status:13

        };

        if(search){

            filter.$or=[

                {

                    name:{
                        $regex:search,
                        $options:"i"
                    }

                },

                {

                    code:{
                        $regex:search,
                        $options:"i"
                    }

                }

            ];

        }

        const states=await StateModel.find(filter)

        .sort({

            created_at:-1

        })

        .skip(skip)

        .limit(limit);

        const total=await StateModel.countDocuments(filter);

        return res.status(200).json({

            message:"State fetched successfully.",

            data:states,

            pagination:{

                total,

                page,

                limit,

                totalPages:Math.ceil(total/limit)

            }

        });

    }

    catch(error){

        return res.status(500).json({

            error:"Internal server error."

        });

    }

}


export const getSingleState = async (
req:Request,
res:Response
)=>{

const {id}=req.body;

if(!id){

return res.status(400).json({

error:"State id required."

});

}

const state=await StateModel.findById(id);

if(!state){

return res.status(404).json({

error:"State not found."

});

}

return res.status(200).json({

message:"State fetched successfully.",

data:state

});

}


export const deleteState = async (
req:Request,
res:Response
)=>{

const {id}=req.body;

if(!id){

return res.status(400).json({

error:"State id required."

});

}

const state=await StateModel.findByIdAndUpdate(

id,

{

status:14

},

{

new:true

}

);

if(!state){

return res.status(404).json({

error:"State not found."

});

}

return res.status(200).json({

message:"State deleted successfully.",

data:state

});

}