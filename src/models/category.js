import mongoose from "mongoose";

const cetegorySchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
})
export const Category=mongoose.model("Category",cetegorySchema)