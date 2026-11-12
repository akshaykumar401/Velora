import { Router } from 'express'
import {
  adminLogin,
  adminLogout,
  deleteReview,
  getAdminMe,
  getAdminOrderById,
  getAllOrders,
  getAllReviews,
  getDashboardStats,
  resendOrderReceipt,
  updateAdminMe,
  updateOrderStatus,
  updateReviewStatus,
} from '../controllers/admin.controller.js'
import { verifyAdminAuth } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/login', adminLogin)
router.post('/logout', verifyAdminAuth, adminLogout)

router.route('/me').get(verifyAdminAuth, getAdminMe).patch(verifyAdminAuth, updateAdminMe)
router.get('/dashboard', verifyAdminAuth, getDashboardStats)

router.get('/orders', verifyAdminAuth, getAllOrders)
router.get('/orders/:orderId', verifyAdminAuth, getAdminOrderById)
router.patch('/orders/:orderId/status', verifyAdminAuth, updateOrderStatus)
router.post('/orders/:orderId/resend-receipt', verifyAdminAuth, resendOrderReceipt)

router.get('/reviews', verifyAdminAuth, getAllReviews)
router.patch('/reviews/:reviewId/status', verifyAdminAuth, updateReviewStatus)
router.delete('/reviews/:reviewId', verifyAdminAuth, deleteReview)

export default router

