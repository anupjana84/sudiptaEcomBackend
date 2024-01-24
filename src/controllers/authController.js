import { User } from "../models/user.js";
import cookieParser from "cookie-parser";
import bcrypt from 'bcryptjs'
import { asyncHandeler } from "../utils/asyncHandeler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { userFindService } from "../services/userService.js";
import { options } from "../utils/Option.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import jwt from 'jsonwebtoken'
import { UserDto } from "../dtos/userDto.js";

// access token and refresh token generate
const accessTokenRefreshTokeGenerate = async (userId) => {
    try {
        const user = await userFindService(userId)
        
        if (!user) {
            throw new ApiError(404, "User not found")
        }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }

    } catch (error) {
        console.log(error)
        throw new ApiError(500, 'Somthing went wrong accesss token and refresh token generate')

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
    }
    
    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(400, "Invalid Credential ")
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password)
    
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid Credential ")
    }
    
    const { accessToken, refreshToken } = await accessTokenRefreshTokeGenerate(user._id)
    
    // const logigUser = await User.findById(user._id).select('-password' + '-refreshToken' + '-__v')
   
    res.status(200)
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
const refreshTokenAccessTokengenerateAgain =
    asyncHandeler(async (req, res) => {
        const cookieToken = req.cookies.refreshToken || req.body.refreshToken
        if (!cookieToken) {
            throw new ApiError(401, "Unauthorized Request")
        }
        try {
            const decodedToken = jwt.verify(cookieToken, process.env.REFRESH_TOKEN_SECRET)
            const user = await userFindService(decodedToken._id)
            if (!user) {
                throw new ApiError(401, "Invalid refresh token")
    
            }
            if (user.refreshToken !== cookieToken) {
                throw new ApiError(401, " Refresh Token Expired")
    
            }
            const { accessToken, refreshToken } = await accessTokenRefreshTokeGenerate(decodedToken._id)
        
            res.status(200)
                .cookie('accessToken', accessToken, options)
                .cookie('refreshToken', refreshToken, options)
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

const logout = asyncHandeler(async (req, res) => { })


export { register, login, refreshTokenAccessTokengenerateAgain } 