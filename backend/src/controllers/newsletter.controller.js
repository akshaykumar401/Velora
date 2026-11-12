import { Newsletter } from '../models/newsletter.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { buildNewsletterWelcomeEmail } from '../utils/emailTemplates.js'
import {
  isDeliverableEmail,
  notifyInBackground,
  sendMailSafe,
} from '../utils/mailService.js'

export const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email, source = 'footer' } = req.body

  if (!email?.trim()) {
    throw new ApiError(400, 'Email address is required')
  }

  const normalized = email.trim().toLowerCase()
  if (!isDeliverableEmail(normalized)) {
    throw new ApiError(400, 'Please enter a valid email address')
  }

  await Newsletter.findOneAndUpdate(
    { email: normalized },
    { email: normalized, source },
    { upsert: true, returnDocument: 'after' },
  )

  notifyInBackground(
    () =>
      sendMailSafe({
        to: normalized,
        ...buildNewsletterWelcomeEmail({ source }),
        context: `newsletter:${source}`,
      }),
    'newsletter-welcome',
  )

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { email: normalized },
        'Thank you for joining the Velora Circle',
      ),
    )
})

