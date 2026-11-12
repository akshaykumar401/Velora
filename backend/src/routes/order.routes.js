import { Router } from 'express'
import {
  createRazorpayOrder,
  getMyOrderById,
  getMyOrders,
  getPaymentConfig,
  verifyRazorpayPayment,
} from '../controllers/order.controller.js'
import { verifyCustomerAuth } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(verifyCustomerAuth)
router.route('/payment/config').get(getPaymentConfig)
router.route('/razorpay/create-order').post(createRazorpayOrder)
router.route('/razorpay/verify').post(verifyRazorpayPayment)
router.route('/my').get(getMyOrders)
router.route('/my/:orderId').get(getMyOrderById)

export default router
