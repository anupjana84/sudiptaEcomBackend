import { Product } from "../models/product.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandeler } from "../utils/asyncHandeler.js";

import jimp from "jimp"
import fs  from 'fs';


const  isBase64Buffer= (str)=> {
    try {
        // Attempt to create a Buffer from the string
        const buffer = Buffer.from(str, 'base64');
        // If no errors occur, and the buffer is successfully created, then it's valid Base64
        return buffer.toString('base64') === str;
    } catch (error) {
        // If an error occurs during Buffer creation, it's not valid Base64
        return false;
    }
}

// const  isBase64=(str) =>{
//     // Regular expression to check if the string is a valid Base64 encoded string
//     const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
//     return base64Regex.test(str);
// }
const procuctCreateController=asyncHandeler(async(req,res)=>{
    const {title,price,stock,description,category, image}=req.body
    
    
    const buffer = Buffer.from(
        image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
        'base64'
    );
    
    const imagePath=`${Date.now()}_${Math.round(Math.random()*1e9)}.png`

    
    try {
        const jimpResponse=await jimp.read(buffer)
        jimpResponse.resize(250,jimp.AUTO).write(`./public/${imagePath}`)
    } catch (error) {
        // console.log(error)
        return res.status(500).json({message:"Failed to upload image"})
    }

   
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
//   console.log(res.body)
//    console.log(imagePathArray)
    //  fs.unlinkSync('public',imagePathArray[1]);
     fs.unlinkSync("public"+'/'+imagePathArray[1])
     if (deleteProduct) {
      const product=await Product.find().populate("category", "title")   
      res.status(200).json(new ApiResponse(200, {product}, "Product Delete Successfylly"))
     }
   
     //res.status(200).json(new ApiResponse(200, {}, "Product Delete Successfylly"))

})
const productEditController=asyncHandeler(async(req, res)=>{
    const {title,price,stock,description,category, image}=req.body
   const oldProduct = await Product.findById(req.params.id)
let buffer
let imagePathnew
let saveImagepath
 if (image.includes(".png")) {
    saveImagepath=image
    
 }else{
    
    buffer = Buffer.from(
        image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
        'base64'
    );
    imagePathnew=`${Date.now()}_${Math.round(Math.random()*1e9)}.png`
    saveImagepath=`/${imagePathnew}`
    try {
        const jimpResponse=await jimp.read(buffer)
        jimpResponse.resize(250,jimp.AUTO).write(`./public${saveImagepath}`)
        const imagePath = oldProduct.image;
   const imagePathArray = imagePath.split("/");
  
 
     fs.unlinkSync("public"+'/'+imagePathArray[1])
    } catch (error) {
        // console.log(error)
        return res.status(500).json({message:"Failed to upload image"})
    }
 }
//  saveImagepath=image


// console.log(buffer)

   const editProduct = await Product.findByIdAndUpdate(req.params.id,{
    $set:{
        title:title,
        price:price,
        stock:stock,
        category:category,
        description:description,
        image:saveImagepath
    },
   },{
    new:true
})
   
     if (editProduct) {
      const product=await Product.find().populate("category", "title")   
      res.status(200).json(new ApiResponse(200, {product}, "Product Edit Successfylly"))
     }
   
    // res.status(200).json(new ApiResponse(200, {product}, "Product Delete Successfylly"))

})
export {procuctCreateController,allProductController,productDeleteController,productEditController}


