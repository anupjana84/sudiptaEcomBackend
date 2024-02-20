import { Product } from "../models/product";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandeler } from "../utils/asyncHandeler";


const procuctCreateController=asyncHandeler(async(req,res)=>{
    const {name,price,description,category}=req.body
    const product=Product.create({name,price,description,category})
    return res.status(201).json(ApiResponse.success(product))
})