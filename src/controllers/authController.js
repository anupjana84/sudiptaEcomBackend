import { User } from "../models/user.js";
import cookieParser from "cookie-parser";
import bcrypt from 'bcryptjs'
import { asyncHandeler } from "../utils/asyncHandeler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { userFindService } from "../services/userService.js";
import { options } from "../utils/Option.js";

import jwt from 'jsonwebtoken'


// access token and refresh token generate
const accessTokenRefreshTokeGenerate = async (userId) => {
    try {
        const user = await userFindService(userId)
        
        // if (!user) {
        //     // throw new ApiError(404, "User not found")
        //    return  res.status(404).json({message:"User not found"})
        // }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
       return  { accessToken, refreshToken }

    } catch (error) {
       
       return  res.status(500).json({message:"Somthing went wrong accesss token and refresh token generate"})

    }


}


const register = asyncHandeler(async (req, res) => {
    const { name, email, password } = req.body;
    if ([name, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")

    }
    const existedUser = await User.findOne({
        $or: [{ email }, { name }]
    })
    if (existedUser) {
        throw new ApiError(400, "Email Already Register")
    }
    const user = await User.create({
        name,
        email,
        password
    })

    if (user) {
        return res.status(201).json(
            new ApiResponse(201,
                {
                    email: user.email,
                    _id: user._id,
                    role: user.role,
                    name: user.name,
                },
                "User Created Successfully")
        )
    }
})

//login
const login = asyncHandeler(async (req, res) => {
    const { email, password } = req.body
    if (!email && !password) {
        throw new ApiError(400, "Invalid Credential")
        // return res.status(400).json({message:'Invalid Credential'})
        return res.status(401).json({ message: 'Invalid Credential' });
    }
    
    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(400, "Invalid Credential ")
        return res.status(400).json({message:'Invalid Credential'})
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password)
    
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid Credential ")
        return res.status(400).json({message:'Invalid Credential'})
    }
    
    const { accessToken, refreshToken } = await accessTokenRefreshTokeGenerate(user._id)
    
    // const logigUser = await User.findById(user._id).select('-password' + '-refreshToken' + '-__v')
   
   return res.status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        
        .json(
            new ApiResponse(200, {
             email: user.email,
                _id: user._id,
                role: user.role,
                name: user.name,
                accessToken, refreshToken

            }, "User Logged In Successfylly")
        )
    // const token = user.generateAccessToken()
})



// access token rotated
const refreshTokenAccessTokengenerateAgain =asyncHandeler(async (req, res) => {
        const cookieToken = req.cookies.refreshToken || req.body.refreshToken
        console.log(cookieToken)
        if (!cookieToken) {
            throw new ApiError(401, "Unauthorized Request")
        }
        try {
            const decodedToken = jwt.verify(cookieToken, process.env.REFRESH_TOKEN_SECRET)
            
            
            const user = await userFindService(decodedToken._id)
            if (!user) {
                throw new ApiError(401, "Invalid refresh token")
    
            }
            if (cookieToken!==  user.refreshToken ) {
                throw new ApiError(401, " Refresh Token Expired")
    
            }
            const { accessToken, refreshToken } = await accessTokenRefreshTokeGenerate(decodedToken._id)
        
            res.status(200)
                .cookie('accessToken', accessToken, )
                .cookie('refreshToken', refreshToken, )
                .json(
                    new ApiResponse(200,{
                        email: user.email,
                           _id: user._id,
                           role: user.role,
                           name: user.name,
                           accessToken, refreshToken
           
                       }, "User Login Successfully")

                  )
        } catch (error) {
            throw new ApiError(401, error?.message  || "Invalid refresh token" )
        }


    })

    const logoutUser = asyncHandeler(async(req, res) => {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1 // this removes the field from document
                }
            },
            {
                new: true
            }
        )
    
        // let options = {
        //     httpOnly: true,
        //     secure: true
        // }
    
        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
    })


export { register, login, refreshTokenAccessTokengenerateAgain, logoutUser } 