import { Router } from 'express'
import {
  createProductReview,
  getProductReviews,
} from '../controllers/review.controller.js'
import {
  optionalCustomerAuth,
  verifyCustomerAuth,
} from '../middlewares/auth.middleware.js'

const router = Router()

router
  .route('/product/:productSlug')
  .get(optionalCustomerAuth, getProductReviews)
  .post(verifyCustomerAuth, createProductReview)

export default router

