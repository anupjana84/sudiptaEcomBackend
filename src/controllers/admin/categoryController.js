import {
  findOneCategory,
  findManyCategory,
  createCategory,
} from "../../services/categoryService.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { asyncHandeler } from "../../utils/asyncHandeler.js"

const createCategoryController = asyncHandeler(async (req, res) => {
  const { title } = req.body

  if (!title) {
    throw new ApiError(400, "Please provide name")
  }
  const category = await findOneCategory("title", title)
  if (category) {
    throw new ApiError(401, "Category Already register")
  }
  const categoryCreated = await createCategory("title", title)
  if (categoryCreated) {
    res
      .status(200)
      .json(
        new ApiResponse(200, categoryCreated, "Cetegory created Successfully")
      )
  }
})
const getAllCategoryController = asyncHandeler(async (_, res) => {
   const getCategory = await findManyCategory()
//   console.log(getCategory)
setTimeout(() => {
  res.status(200).json(new ApiResponse(200, getCategory, "All Category"))
}, 3000);
   
})

export { createCategoryController, getAllCategoryController }
