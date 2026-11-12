import { Router } from 'express'
import {
  getMailStatus,
  sendAdminTestMail,
  submitContactInquiry,
} from '../controllers/mail.controller.js'
import { verifyAdminAuth } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/contact', submitContactInquiry)
router.get('/status', verifyAdminAuth, getMailStatus)
router.post('/test', verifyAdminAuth, sendAdminTestMail)

export default router

