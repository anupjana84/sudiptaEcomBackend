import  {Router}  from "express";

import { register,login,refreshTokenAccessTokengenerateAgain
,logoutUser }
 from "../controllers/authController.js";
import { getAllUser } from "../controllers/admin/userControllerForAdmin.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";





const router=Router();


router.route("/logout").post(verifyToken,  logoutUser)
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/allUser').get(verifyToken, getAllUser)
router.route('/refresh').get(refreshTokenAccessTokengenerateAgain)
















export default router