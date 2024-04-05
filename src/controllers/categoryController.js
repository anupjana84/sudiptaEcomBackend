import { Category } from "../models/category.js"
import {
  findOneCategory,
  findManyCategory,
  createCategory,
} from "../services/categoryService.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandeler } from "../utils/asyncHandeler.js"

const createCategoryController = asyncHandeler(async (req, res) => {
  const { title } = req.body
  // console.log(title)
  // return res.status(200).json(title )

  if (!title) {
    throw new ApiError(400, "Please provide title")
  }
  const category = await findOneCategory("title", title)
  if (category) {
   // throw new ApiError(401, "Category Already register")
    // const error = new Error('User already exists');
		// error.status = 400;
		// throw error;
     return res.status(401).json({ message: 'Category already save' });

  }
  const categoryCreated = await createCategory("title", title)
  if (categoryCreated) {
    res
    .status(200)
    .json(
      new ApiResponse(200, categoryCreated, "Cetegory created Successfully")
    )
    setTimeout(() => {
     
    }, 5000);
    
  }
})
const getAllCategoryController = asyncHandeler(async (_, res) => {
   const getCategory = await findManyCategory()
//   console.log(getCategory)
res.status(200).json(new ApiResponse(200, getCategory, "All Category"))

   
})

const deleteCategoryController = asyncHandeler(async (req, res) => {
  const { _id } = req.body
   const deleteCategory =await Category.findByIdAndDelete(_id)
  if (!deleteCategory) {
    throw new ApiError(404, "Category not found")
  }
  
  res.status(200).json(new ApiResponse(200, deleteCategory, "Category Deleted"))

  
})

export { createCategoryController, getAllCategoryController,deleteCategoryController }
