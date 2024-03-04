import { Router} from "express";
import { createCategoryController,
  getAllCategoryController,deleteCategoryController} from "../controllers/categoryController.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";


const router = Router();

router.route("/createCategory").post(createCategoryController);
router.route("/allCategory").get(getAllCategoryController);
router.route("/deleteCategory").post(deleteCategoryController);

export default router