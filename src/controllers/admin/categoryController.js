import { findCategory,createCategory } from "../../services/categoryService.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandeler } from "../../utils/asyncHandeler.js";

 const createCategoryController  = asyncHandeler(async (req, res) => {

const {title}=req.body
// console.log(req.body)
// console.log(name)
//  return res.status(400).json(
//     new ApiResponse(200,{name:name},"Cetegory created Successfully")
// )
if(!title){
 throw new ApiError(400,"Please provide name")
}
const category=await findCategory("title",title)
if(category){
 throw new ApiError(401,"Category Already register")
}
const categoryCreated=await createCategory("title",title)
if(categoryCreated){
    res.status(400).json(
        new ApiResponse(200,categoryCreated,"Cetegory created Successfully")
    )
   
}

})

export { createCategoryController }
