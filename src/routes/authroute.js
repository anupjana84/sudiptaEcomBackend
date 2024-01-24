import  {Router}  from "express";

import { register,login,refreshTokenAccessTokengenerateAgain }
 from "../controllers/authController.js";
import { getAllUser } from "../controllers/admin/userControllerForAdmin.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";





const route=Router();



route.route('/register').post(register)
route.route('/login').post(login)
route.route('/allUser').get(verifyToken,isAdmin, getAllUser)
route.route('/refresh').post(refreshTokenAccessTokengenerateAgain)
















export default route