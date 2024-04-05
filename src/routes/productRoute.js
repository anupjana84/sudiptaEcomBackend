import {Router} from 'express'
import { procuctCreateController,allProductController } from '../controllers/productController.js'
const router =Router()



router.route('/save').post(procuctCreateController)
router.route('/all').get(allProductController)

export default router

