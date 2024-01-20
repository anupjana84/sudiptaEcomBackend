import  {Router}  from "express";

import { register,login } from "../controllers/userController.js";
import { getAllUser } from "../controllers/admin/userControllerForAdmin.js";
import { verifyToken } from "../middlewares/authMiddleware.js";





const route=Router();



route.route('/register').post(register)
route.route('/login').post(login)
route.route('/allUser').get(verifyToken,getAllUser)
















export default route