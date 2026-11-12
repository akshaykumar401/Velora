import { Router } from 'express'
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../controllers/category.controller.js'
import { verifyAdminAuth } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'

const router = Router()

router
  .route('/')
  .get(getCategories)
  .post(verifyAdminAuth, upload.single('image'), createCategory)
router
  .route('/:id')
  .patch(verifyAdminAuth, upload.single('image'), updateCategory)
  .delete(verifyAdminAuth, deleteCategory)

export default router

