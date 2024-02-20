import { Category } from "../models/category.js";

export const findCategory =  (key,value) => {
    console.log(key)
  return  Category.findOne({[key]:value})


}

export const createCategory = (key,value) => {
return  Category.create({
[key]:value
})
}