import { Category } from "../models/category.js";

export const findOneCategory =  (key,value) => {
    
  return  Category.findOne({[key]:value})


}

export const createCategory = (key,value) => {
return  Category.create({
[key]:value
})
}

export const findManyCategory = () => {
return  Category.find()
}