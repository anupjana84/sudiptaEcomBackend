import  express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "./routes/authroute.js";
import healthRoute from "./routes/healthRoute.js";





const app = express();

const corsOption = {
    origin: ['http://localhost:5173'],
};

app.use(cors({
    origin: 'http://localhost:5173',
  credentials: true,
}))


app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());


app.use("/health",healthRoute);
app.use("/api/v1/auth",authRoute);



export {app}