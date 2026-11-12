import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  getProductDetail,
  getProducts,
  updateProduct,
} from '../controllers/product.controller.js'
import {
  optionalCustomerAuth,
  verifyAdminAuth,
} from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'

const router = Router()

router
  .route('/')
  .get(getProducts)
  .post(verifyAdminAuth, upload.single('image'), createProduct)
router.route('/:idOrSlug').get(optionalCustomerAuth, getProductDetail)
router
  .route('/:id')
  .patch(verifyAdminAuth, upload.single('image'), updateProduct)
  .delete(verifyAdminAuth, deleteProduct)

export default router

