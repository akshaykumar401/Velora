import { Router } from 'express'
import {
  getStorefrontSettings,
  updateStorefrontSettings,
} from '../controllers/settings.controller.js'
import { verifyAdminAuth } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'

const router = Router()

router
  .route('/')
  .get(getStorefrontSettings)
  .patch(
    verifyAdminAuth,
    upload.fields([
      { name: 'heroImage', maxCount: 1 },
      { name: 'philosophyImage', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
    updateStorefrontSettings,
  )

export default router

