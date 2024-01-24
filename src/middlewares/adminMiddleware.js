import jwt from 'jsonwebtoken';
import { asyncHandeler } from '../utils/asyncHandeler.js';
import { ApiError } from '../utils/ApiError.js';
import { userFindService } from '../services/userService.js';

const isAdmin = asyncHandeler(async(req, _, next)=>{
   try {
    if(req.user.role==="user"){
        throw new ApiError(401,  "You are Not Admin ")
    }
   
    next();
   } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access Token")
   }


})
export {isAdmin}