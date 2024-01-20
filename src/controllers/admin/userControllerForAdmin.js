import { User } from "../../models/user.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { asyncHandeler } from "../../utils/asyncHandeler.js"




const getAllUser=asyncHandeler(async(req,res)=>{
return res.status(200).json(
   new ApiResponse(200,{},"yes")
)

})
export {getAllUser}