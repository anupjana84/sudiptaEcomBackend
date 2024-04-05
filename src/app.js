import  express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "./routes/authroute.js";
import healthRoute from "./routes/healthRoute.js";

import categoryRoute from "./routes/categoryRoute.js";
import productRoute from './routes/productRoute.js'




const app = express();

const corsOption = {
    origin: ['http://localhost:5173'],
};

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))


app.use(express.json({limit:"8mb"}));
app.use(express.urlencoded({extended:true,limit:"8mb"}));
app.use(express.static("public"));
app.use(cookieParser());


app.use("/health",healthRoute);
app.use("/api/v1/auth",authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);



export {app}