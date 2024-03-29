import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true,
    },
    stock:{
        type: Number,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }
})

export const Product = mongoose.model("Product", productSchema)