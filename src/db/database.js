import mongoose from "mongoose";
import {databaseName} from "../constants.js"





export const dbconnect = async () => {
    try {
       
        const connection = await mongoose.connect(`${process.env.MONGO_URI}/${databaseName}`)
        console.log(`Database connected ${connection.connection.host}`)



    } catch (error) {
        console.log(`Database connection failed ${error}`,)
        process.exit(1);
    }
}