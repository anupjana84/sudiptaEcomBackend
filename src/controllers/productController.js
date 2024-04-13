import { Product } from "../models/product.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandeler } from "../utils/asyncHandeler.js";
import path from "path"
import jimp from "jimp"
import fs  from 'fs';
import { fileURLToPath } from 'url';

const procuctCreateController=asyncHandeler(async(req,res)=>{
    const {title,price,stock,description,category, image}=req.body
    // console.log(title,price,stock,description,category,)
    const buffer = Buffer.from(
        image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
        'base64'
    );
    const imagePath=`${Date.now()}_${Math.round(Math.random()*1e9)}.png`

    // console.log(buffer)
    try {
        const jimpResponse=await jimp.read(buffer)
        jimpResponse.resize(250,jimp.AUTO).write(`./public/${imagePath}`)
    } catch (error) {
        // console.log(error)
        return res.status(500).json({message:"Failed to upload image"})
    }

    // console.log(req.body)
    // console.log(title)
    if (!title || !price|| !stock || !description || !category) {
        return res.status(400).json({message:"Please provide all value "})
    }
    const product=Product.create({title,price,stock,description,category,image:`/${imagePath}`})
    return res.status(200).json(new ApiResponse(200, 
        product

       , "Product Created Successfylly"))
})

const allProductController=asyncHandeler(async(_, res)=>{
    const product=await Product.find().populate("category","title")
    res.status(200).json(new ApiResponse(200, {product}, "Product Fetch Successfylly"))
    //  res.status(200).json(new ApiResponse(200, 
    //     product

    //    , "Product Fetch Successfylly"))

})
const productDeleteController=asyncHandeler(async(req, res)=>{
   
   const deleteProduct = await Product.findByIdAndDelete(req.params.id)
   const imagePath = deleteProduct.image;
   const imagePathArray = imagePath.split("/");
  
   console.log(imagePathArray)
    //  fs.unlinkSync('public',imagePathArray[1]);
     fs.unlinkSync("public"+'/'+imagePathArray[1])
     if (deleteProduct) {
      const product=await Product.find().populate("category", "title")   
      res.status(200).json(new ApiResponse(200, {product}, "Product Delete Successfylly"))
     }
   
    // res.status(200).json(new ApiResponse(200, {product}, "Product Delete Successfylly"))

})
export {procuctCreateController,allProductController,productDeleteController}


