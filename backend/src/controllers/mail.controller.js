import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  buildContactAutoReplyEmail,
  buildContactConciergeEmail,
  escapeHtml,
} from '../utils/emailTemplates.js'
import {
  checkMailServiceHealth,
  getConciergeNotificationEmails,
  isDeliverableEmail,
  notifyInBackground,
  sendMail,
  sendMailSafe,
} from '../utils/mailService.js'

export const submitContactInquiry = asyncHandler(async (req, res) => {
  const { name, email, topic = 'General Atelier Inquiry', message } = req.body

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    throw new ApiError(400, 'Name, email address, and message are required')
  }

  const normalizedEmail = email.trim().toLowerCase()
  if (!isDeliverableEmail(normalizedEmail)) {
    throw new ApiError(400, 'Please provide a valid email address')
  }

  const cleanName = name.trim()
  const cleanTopic = String(topic).trim() || 'General Atelier Inquiry'
  const cleanMessage = message.trim()

  const conciergeRecipients = getConciergeNotificationEmails()

  if (conciergeRecipients.length > 0) {
    const conciergeTemplate = buildContactConciergeEmail({
      name: cleanName,
      email: normalizedEmail,
      topic: cleanTopic,
      message: cleanMessage,
    })

    const results = await Promise.allSettled(
      conciergeRecipients.map((recipient) =>
        sendMail({ to: recipient, ...conciergeTemplate }),
      ),
    )

    const deliveredCount = results.filter((r) => r.status === 'fulfilled').length
    if (deliveredCount === 0) {
      const firstError = results[0]?.reason?.message
      throw new ApiError(
        502,
        firstError || 'Unable to deliver inquiry email at this time',
      )
    }

    notifyInBackground(
      () =>
        sendMailSafe({
          to: normalizedEmail,
          ...buildContactAutoReplyEmail({ name: cleanName, topic: cleanTopic }),
          context: 'contact-auto-reply',
        }),
      'contact-auto-reply',
    )
  } else {
    await sendMail({
      to: normalizedEmail,
      ...buildContactAutoReplyEmail({ name: cleanName, topic: cleanTopic }),
    })
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { delivered: true },
        'Thank you. Your inquiry has been sent to our atelier concierge.',
      ),
    )
})

export const getMailStatus = asyncHandler(async (_req, res) => {
  const health = await checkMailServiceHealth()
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...health,
        conciergeRecipientsCount: getConciergeNotificationEmails().length,
      },
      'Mail service status fetched',
    ),
  )
})

export const sendAdminTestMail = asyncHandler(async (req, res) => {
  const targetEmail =
    req.body?.to?.trim() || req.admin?.contactEmail || req.admin?.email || ''

  if (!isDeliverableEmail(targetEmail)) {
    throw new ApiError(400, 'Valid recipient email is required')
  }

  const result = await sendMail({
    to: targetEmail,
    subject: 'Velora Atelier · Mail Service Diagnostic',
    body: `<p>Hello ${escapeHtml(req.admin?.fullName || 'Administrator')},</p><p>Your Velora Mail Service integration is connected and delivering messages successfully.</p>`,
  })

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Test email sent successfully'))
})
