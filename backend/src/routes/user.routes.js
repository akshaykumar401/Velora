import { Router } from 'express'
import {
  addAddress,
  addToCart,
  clearCart,
  deleteAddress,
  getProfile,
  login,
  logout,
  refreshAccessToken,
  removeCartItem,
  setDefaultAddress,
  signup,
  syncCustomerSession,
  toggleWishlist,
  updateAddress,
  updateCartItem,
  updateProfile,
} from '../controllers/user.controller.js'
import { verifyCustomerAuth } from '../middlewares/auth.middleware.js'

const router = Router()

// Public local auth endpoints
router.post('/signup', signup)
router.post('/login', login)
router.post('/refresh-token', refreshAccessToken)

// Authenticated customer endpoints (Clerk or local JWT)
router.post('/logout', verifyCustomerAuth, logout)
router.post('/sync', verifyCustomerAuth, syncCustomerSession)
router.route('/profile').get(verifyCustomerAuth, getProfile).patch(verifyCustomerAuth, updateProfile)

router.route('/addresses').post(verifyCustomerAuth, addAddress)
router
  .route('/addresses/:addressId')
  .patch(verifyCustomerAuth, updateAddress)
  .delete(verifyCustomerAuth, deleteAddress)
router.patch('/addresses/:addressId/default', verifyCustomerAuth, setDefaultAddress)

router.post('/wishlist/toggle', verifyCustomerAuth, toggleWishlist)

router
  .route('/cart')
  .post(verifyCustomerAuth, addToCart)
  .delete(verifyCustomerAuth, clearCart)
router
  .route('/cart/:itemId')
  .patch(verifyCustomerAuth, updateCartItem)
  .delete(verifyCustomerAuth, removeCartItem)

export default router
