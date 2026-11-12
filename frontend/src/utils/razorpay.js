const RAZORPAY_CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js'

let scriptPromise = null

/**
 * Loads the official Razorpay Standard Checkout script once and caches the promise.
 */
export const loadRazorpayScript = () => {
  if (typeof window === 'undefined') {
    return Promise.resolve(false)
  }
  if (window.Razorpay) {
    return Promise.resolve(true)
  }
  if (scriptPromise) {
    return scriptPromise
  }

  scriptPromise = new Promise((resolve) => {
    const existing = document.querySelector(
      `script[src="${RAZORPAY_CHECKOUT_SRC}"]`,
    )
    if (existing) {
      existing.addEventListener('load', () => resolve(Boolean(window.Razorpay)), {
        once: true,
      })
      existing.addEventListener(
        'error',
        () => {
          scriptPromise = null
          resolve(false)
        },
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.src = RAZORPAY_CHECKOUT_SRC
    script.async = true
    script.onload = () => resolve(Boolean(window.Razorpay))
    script.onerror = () => {
      scriptPromise = null
      resolve(false)
    }
    document.body.appendChild(script)
  })

  return scriptPromise
}

const sanitizeContact = (phone) => {
  const cleaned = String(phone || '')
    .trim()
    .replace(/[^\d+]/g, '')
  return cleaned.length >= 8 ? cleaned : ''
}

/**
 * Opens Razorpay Checkout modal and resolves with verified payment tokens or rejects on cancel/failure.
 */
export const openRazorpayCheckout = ({
  keyId,
  razorpayOrderId,
  amount,
  currency = 'INR',
  name = 'VELORA',
  description = 'Velora Atelier Order',
  prefill = {},
  notes = {},
}) => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.Razorpay) {
      reject(new Error('Razorpay Checkout SDK is unavailable'))
      return
    }

    let settled = false
    let lastFailureMessage = ''

    const rzp = new window.Razorpay({
      key: keyId,
      amount,
      currency,
      name,
      description,
      order_id: razorpayOrderId,
      prefill: {
        name: prefill.name || '',
        email: prefill.email || '',
        contact: sanitizeContact(prefill.contact),
      },
      notes,
      theme: {
        color: '#151413',
      },
      handler: (response) => {
        if (settled) return
        settled = true
        resolve({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        })
      },
      modal: {
        confirm_close: true,
        ondismiss: () => {
          if (settled) return
          settled = true
          const err = new Error(
            lastFailureMessage || 'Payment window was closed before completion.',
          )
          err.code = lastFailureMessage ? 'PAYMENT_FAILED' : 'PAYMENT_CANCELLED'
          reject(err)
        },
      },
    })

    rzp.on('payment.failed', (response) => {
      const reason =
        response?.error?.description ||
        response?.error?.reason ||
        'Payment authorization failed'
      lastFailureMessage = reason
    })

    rzp.open()
  })
}

