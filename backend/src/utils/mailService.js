import { Newsletter } from '../models/newsletter.model.js'
import { User } from '../models/user.model.js'
import { ApiError } from './ApiError.js'
import { parseConfiguredAdminAccounts } from './adminConfig.js'

const DEFAULT_MAIL_SERVICE_URL = 'https://tour-traval-phi.vercel.app'
const MAIL_TIMEOUT_MS = 15000
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const getMailServiceUrl = () => {
  const raw = process.env.MAIL_SERVICE_URL?.trim() || DEFAULT_MAIL_SERVICE_URL
  return raw.replace(/\/+$/, '')
}

export const isMailServiceEnabled = () => {
  if (process.env.MAIL_SERVICE_ENABLED?.trim().toLowerCase() === 'false') {
    return false
  }
  const url = getMailServiceUrl().toLowerCase()
  return !['false', 'off', 'disabled', 'none'].includes(url)
}

export const isDeliverableEmail = (email) => {
  if (typeof email !== 'string') return false
  const normalized = email.trim().toLowerCase()
  if (!EMAIL_REGEX.test(normalized)) return false
  return !normalized.endsWith('.local')
}

export const getConciergeNotificationEmails = () => {
  const configured = (process.env.CONCIERGE_EMAIL || '')
    .split(',')
    .map((entry) => entry.trim().replace(/^['"]|['"]$/g, '').toLowerCase())
    .filter(isDeliverableEmail)

  if (configured.length > 0) {
    return [...new Set(configured)]
  }

  return [
    ...new Set(
      parseConfiguredAdminAccounts()
        .map((account) => account.email)
        .filter(isDeliverableEmail),
    ),
  ]
}

export const getStorefrontOrigin = () => {
  const explicit = process.env.FRONTEND_URL?.trim()
  if (explicit && /^https?:\/\//i.test(explicit)) {
    return explicit.replace(/\/+$/, '')
  }

  const corsCandidate = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((entry) => entry.trim())
    .find((entry) => entry && entry !== '*' && /^https?:\/\//i.test(entry))

  return corsCandidate ? corsCandidate.replace(/\/+$/, '') : ''
}

/**
 * Returns deduplicated deliverable email addresses from Newsletter subscribers and opted-in customers.
 */
export const getSubscribedRecipientEmails = async () => {
  const [newsletterDocs, customerDocs] = await Promise.all([
    Newsletter.find().select('email -_id').lean(),
    User.find({ role: 'customer' }).select('email newsletterOptIn -_id').lean(),
  ])

  const optedOutEmails = new Set()
  const recipients = new Set()

  for (const user of customerDocs) {
    const email = String(user?.email || '').trim().toLowerCase()
    if (!email) continue
    if (user.newsletterOptIn === false) {
      optedOutEmails.add(email)
    } else if (isDeliverableEmail(email)) {
      recipients.add(email)
    }
  }

  for (const sub of newsletterDocs) {
    const email = String(sub?.email || '').trim().toLowerCase()
    if (isDeliverableEmail(email) && !optedOutEmails.has(email)) {
      recipients.add(email)
    }
  }

  return [...recipients]
}

/**
 * Dispatches an email through the configured Flask Mail Service (/send-mail).
 */
export const sendMail = async ({ to, subject, body }) => {
  if (!isMailServiceEnabled()) {
    throw new ApiError(503, 'Mail service is currently disabled')
  }
  if (!isDeliverableEmail(to)) {
    throw new ApiError(400, 'A valid deliverable recipient email is required')
  }
  if (!subject?.trim() || !body?.trim()) {
    throw new ApiError(400, 'Email subject and body are required')
  }

  const endpoint = `${getMailServiceUrl()}/send-mail`
  let response
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipients: to.trim().toLowerCase(),
        subject: subject.trim(),
        body,
      }),
      signal: AbortSignal.timeout(MAIL_TIMEOUT_MS),
    })
  } catch (err) {
    throw new ApiError(
      502,
      `Unable to reach mail service: ${err?.message || 'network timeout'}`,
    )
  }

  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok || payload?.error || Number(payload?.status) >= 400) {
    throw new ApiError(
      response.status >= 400 ? response.status : 502,
      payload?.error ||
        payload?.message ||
        `Mail service failed with status ${response.status}`,
    )
  }

  return {
    recipient: to.trim().toLowerCase(),
    message: payload?.message || 'Email sent successfully',
  }
}

/**
 * Best-effort wrapper around sendMail that returns delivery status without throwing.
 */
export const sendMailSafe = async ({ to, subject, body, context = 'mail' }) => {
  if (!isMailServiceEnabled() || !isDeliverableEmail(to)) {
    return { ok: false, skipped: true }
  }
  try {
    await sendMail({ to, subject, body })
    return { ok: true }
  } catch (err) {
    console.warn(`[MailService:${context}] Delivery failed:`, err?.message)
    return { ok: false, error: err?.message || 'Delivery failed' }
  }
}

/**
 * Sends separate per-recipient POST requests (Mail_service expects a single email string).
 */
export const sendMailToMany = async ({
  recipients = [],
  subject,
  body,
  context = 'broadcast',
}) => {
  const uniqueRecipients = [
    ...new Set(
      recipients
        .map((r) => String(r || '').trim().toLowerCase())
        .filter(isDeliverableEmail),
    ),
  ]

  if (uniqueRecipients.length === 0) return []

  // Batch small pairs sequentially so Gmail SMTP behind Mail_service avoids concurrency throttles
  const results = []
  const batchSize = 2
  for (let i = 0; i < uniqueRecipients.length; i += batchSize) {
    const batch = uniqueRecipients.slice(i, i + batchSize)
    const batchResults = await Promise.allSettled(
      batch.map((recipient) =>
        sendMailSafe({ to: recipient, subject, body, context }),
      ),
    )
    results.push(...batchResults)
  }

  return results
}

/**
 * Runs non-blocking notification tasks after primary DB mutations complete.
 */
export const notifyInBackground = (taskFn, context = 'background-mail') => {
  Promise.resolve()
    .then(taskFn)
    .catch((err) => {
      console.warn(`[MailService:${context}] Background task error:`, err?.message)
    })
}

export const checkMailServiceHealth = async () => {
  const enabled = isMailServiceEnabled()
  const url = getMailServiceUrl()
  if (!enabled) {
    return { enabled: false, url, reachable: false, message: 'Mail service disabled' }
  }

  try {
    const response = await fetch(`${url}/`, {
      method: 'GET',
      signal: AbortSignal.timeout(8000),
    })
    const payload = await response.json().catch(() => null)
    return {
      enabled: true,
      url,
      reachable: response.ok,
      message: payload?.message || `HTTP ${response.status}`,
    }
  } catch (err) {
    return {
      enabled: true,
      url,
      reachable: false,
      message: err?.message || 'Unable to reach mail service',
    }
  }
}

