import { User } from "../../models/user.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { asyncHandeler } from "../../utils/asyncHandeler.js"
import crypto from "crypto"



const getAllUser=asyncHandeler(async(req,res)=>{
  const hex = crypto.randomBytes(64).toString("hex")
return res.status(200).json(
    
   new ApiResponse(200,{hex},"yes")
)

})
export {getAllUser}