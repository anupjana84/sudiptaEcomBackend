import  {Router}  from "express";

import { register,login } from "../controllers/userController.js";

const route=Router();



route.route('/register').post(register)
route.route('/login').post(login)
















export default route