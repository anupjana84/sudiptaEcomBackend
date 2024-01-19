import { User } from "../models/user.js";
import cookieParser from "cookie-parser";
import bcrypt from 'bcryptjs'
import { asyncHandeler } from "../utils/asyncHandeler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { userFindService } from "../services/userService.js";



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
	if (!email || !password) {
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
	console.log(accessToken, refreshToken)
	// const logigUser = await User.findById(user._id).select('-password' + '-refreshToken' + '-__v')
	// console.log(logigUser,'pp')

const data = 
	res.status(200).json(
		new ApiResponse(200, {
			email: user.email,
			_id: user._id,
			role: user.role,
			name: user.name,
			accessToken, refreshToken
		
		},"User Logged In Successfylly")
	)
	// const token = user.generateAccessToken()
})
export { register, login } 