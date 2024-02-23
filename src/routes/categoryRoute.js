import { Router} from "express";
import { createCategoryController,
  getAllCategoryController} from "../controllers/admin/categoryController.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";


const router = Router();

router.route("/createCategory").post(createCategoryController);
router.route("/allCategory").get(getAllCategoryController);

export default router