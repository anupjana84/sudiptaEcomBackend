import { Router} from "express";
import { createCategoryController } from "../controllers/admin/categoryController.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";


const router = Router(verifyToken,isAdmin);

router.route("/createCategory").post(createCategoryController);

export default router