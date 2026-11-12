import crypto from 'crypto'
import Razorpay from 'razorpay'
import { ApiError } from './ApiError.js'

let cachedClient = null
let cachedCredentialKey = ''

export const getRazorpayCredentials = () => ({
  keyId: process.env.RAZORPAY_KEY_ID?.trim() || '',
  keySecret: process.env.RAZORPAY_KEY_SECRET?.trim() || '',
})

export const isRazorpayConfigured = () => {
  const { keyId, keySecret } = getRazorpayCredentials()
  return Boolean(keyId && keySecret)
}

/**
 * Returns an initialized Razorpay SDK instance keyed by active credentials.
 */
export const getRazorpayClient = () => {
  const { keyId, keySecret } = getRazorpayCredentials()
  if (!keyId || !keySecret) {
    throw new ApiError(
      503,
      'Razorpay payment gateway is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend .env',
    )
  }

  const credentialKey = `${keyId}:${keySecret}`
  if (!cachedClient || cachedCredentialKey !== credentialKey) {
    cachedClient = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
    cachedCredentialKey = credentialKey
  }

  return cachedClient
}

/**
 * Verifies the Razorpay Checkout HMAC-SHA256 payment signature in constant time.
 */
export const verifyRazorpaySignature = ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  const { keySecret } = getRazorpayCredentials()
  if (
    !keySecret ||
    !razorpayOrderId ||
    !razorpayPaymentId ||
    !razorpaySignature
  ) {
    return false
  }

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex')

  const expectedBuffer = Buffer.from(expectedSignature, 'utf8')
  const receivedBuffer = Buffer.from(String(razorpaySignature).trim(), 'utf8')
  if (expectedBuffer.length !== receivedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
}

export const toRazorpayApiError = (err, fallbackMessage) => {
  if (err instanceof ApiError) return err
  const statusCode =
    Number(err?.statusCode) >= 400 && Number(err?.statusCode) < 600
      ? Number(err.statusCode)
      : 502
  const message =
    err?.error?.description ||
    err?.error?.reason ||
    err?.message ||
    fallbackMessage
  return new ApiError(statusCode, message)
}

/**
 * Extracts normalized payment display labels and metadata from a Razorpay payment entity.
 */
export const describeRazorpayPayment = (payment = {}) => {
  const method = String(payment.method || '').toLowerCase()
  const last4 = payment.card?.last4 || ''
  const network = payment.card?.network || ''
  const vpa = payment.vpa || ''
  const bank = payment.bank || ''
  const wallet = payment.wallet || ''

  const METHOD_LABELS = {
    card: network ? `Razorpay · Card (${network})` : 'Razorpay · Card',
    upi: 'Razorpay · UPI',
    netbanking: bank
      ? `Razorpay · NetBanking (${bank})`
      : 'Razorpay · NetBanking',
    wallet: wallet ? `Razorpay · Wallet (${wallet})` : 'Razorpay · Wallet',
    emi: 'Razorpay · EMI',
  }

  return {
    paymentMethod: METHOD_LABELS[method] || 'Razorpay',
    paymentLast4: last4,
    paymentDetails: {
      gateway: 'razorpay',
      razorpayOrderId: payment.order_id || '',
      razorpayPaymentId: payment.id || '',
      method,
      last4,
      network,
      vpa,
      bank,
      wallet,
    },
  }
}
