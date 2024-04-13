import {Router} from 'express'
import { procuctCreateController,allProductController,productDeleteController } from '../controllers/productController.js'
const router =Router()



router.route('/save').post(procuctCreateController)
router.route('/all').get(allProductController)
router.route('/:id').delete(productDeleteController)

export default router

