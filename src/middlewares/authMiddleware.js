import jwt from 'jsonwebtoken';
import { asyncHandeler } from '../utils/asyncHandeler.js';
import { ApiError } from '../utils/ApiError.js';
import { userFindService } from '../services/userService.js';

const verifyToken = asyncHandeler(async(req, _, next)=>{
   try {
     const token = req.cookies.accessToken || req.header("Authorization").replace("Bearer ","")
     if (!token) {
         throw new ApiError(401, " UnAuthorization Request")
     }
     const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userFindService(decoded._id).select("-password"+"-refreshToken" );
    if (!user) {
     throw new ApiError(401, " Invalid Access Token")
    }
    req.user = user
    next();
   } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access Token")
   }


})
export {verifyToken}