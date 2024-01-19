import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const userShema=mongoose.Schema({
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

userShema.pre("save",async function(next){ 
    if(!this.isModified("password")){
        next()
    }
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
    next()
    

 })

 userShema.methods.isPasswordCorrect= async function(password){
    return await bcrypt.compare(password,this.password)

 }
 userShema.methods.generateAccessToken=  function(){
  return  jwt.sign(
        {_id:this._id,
           email:this.email,
           name:this.name,
        role:this.role},
        process.env.JWT_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})

 }
userShema.methods.generateRefreshToken=  function(){
 return   jwt.sign(
        {_id:this._id },
        process.env.JWT_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})

 
}
export const User=mongoose.model("User",userShema)