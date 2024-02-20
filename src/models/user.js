import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
        index:true
    },
    password:{
        type:String,required:true
    },
    profileImage:{
        type:String},
    role:{type:String,
        enum:["user","admin"],
        default:'user',
        required:true
    },
    refreshToken:{
        type:String,
    }

},{
    timestamps:true
})

userSchema.pre("save",async function(next){ 
    if(!this.isModified("password")){
        next()
    }
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
    next()
    

 })

 userSchema.methods.isPasswordCorrect= async function(password){
    return await bcrypt.compare(password,this.password)

 }
 userSchema.methods.generateAccessToken=  function(){
  return  jwt.sign(
        {_id:this._id,
           email:this.email,
           name:this.name,
        role:this.role},
        process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})

 }
 userSchema.methods.generateRefreshToken=  function(){
 return   jwt.sign(
        {_id:this._id },
        process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})

 
}
export const User=mongoose.model("User",userSchema)