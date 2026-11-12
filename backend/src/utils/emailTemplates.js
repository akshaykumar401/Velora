const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

const formatINR = (amount) => {
  const num = Number(amount)
  return inrFormatter.format(Number.isFinite(num) ? num : 0)
}

export const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const buildVeloraEmailShell = ({
  eyebrow,
  title,
  intro,
  bodyHtml = '',
  footerNote = 'Velora Curated Atelier · Handcrafted luxury delivered with care.',
}) => `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background-color:#F6F3EC;font-family:Georgia,'Times New Roman',serif;color:#1A1816;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F6F3EC;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#FCF9F2;border:1px solid #E5DFD3;">
            <tr>
              <td style="padding:28px 32px;border-bottom:1px solid #EAE5DC;text-align:center;">
                <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#8A8379;">
                  ${escapeHtml(eyebrow)}
                </p>
                <h1 style="margin:0;font-size:26px;font-weight:normal;letter-spacing:2px;color:#151413;">
                  VELORA
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h2 style="margin:0 0 12px;font-size:22px;font-weight:normal;color:#1A1816;">
                  ${escapeHtml(title)}
                </h2>
                <p style="margin:0 0 22px;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#5E5951;">
                  ${escapeHtml(intro)}
                </p>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background-color:#F6F3EC;border-top:1px solid #EAE5DC;font-family:Arial,sans-serif;font-size:11px;line-height:1.6;color:#78736B;text-align:center;">
                ${escapeHtml(footerNote)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

const buildOrderItemsRows = (items = []) =>
  items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #EAE5DC;font-family:Arial,sans-serif;font-size:13px;color:#1A1816;">
            <strong>${escapeHtml(item.name)}</strong><br/>
            <span style="font-size:11px;color:#78736B;">
              ${escapeHtml(item.color || 'Default')} · Size ${escapeHtml(item.size || 'One Size')} · Qty ${escapeHtml(item.quantity)}
            </span>
          </td>
          <td align="right" style="padding:10px 0;border-bottom:1px solid #EAE5DC;font-family:Arial,sans-serif;font-size:13px;color:#1A1816;white-space:nowrap;">
            ${escapeHtml(formatINR((item.price || 0) * (item.quantity || 1)))}
          </td>
        </tr>`,
    )
    .join('')

export const buildWelcomeEmail = ({ fullName }) => ({
  subject: 'Welcome to Velora Atelier',
  body: buildVeloraEmailShell({
    eyebrow: 'PRIVATE MEMBERSHIP',
    title: `Welcome, ${fullName || 'Client'}`,
    intro:
      'Your Velora account has been created. Enjoy personalized order tracking, saved delivery addresses, and early access to seasonal atelier releases.',
    bodyHtml: `
      <div style="background-color:#F6F3EC;border:1px solid #EAE5DC;padding:18px 20px;font-family:Arial,sans-serif;font-size:13px;line-height:1.65;color:#4B463F;">
        Our atelier specialists are always available via our Concierge desk for sizing guidance, fabric care, and private appointments.
      </div>`,
  }),
})

export const buildNewsletterWelcomeEmail = ({ source }) => {
  const originLabel =
    source === 'velora-circle' ? 'the Velora Circle' : 'the Velora Journal'
  return {
    subject: 'Welcome to the Velora Circle',
    body: buildVeloraEmailShell({
      eyebrow: 'VELORA CIRCLE',
      title: 'Private Invitation Confirmed',
      intro: `Thank you for subscribing through ${originLabel}. You will receive early previews of new collections, limited editions, and seasonal atelier dispatches.`,
      bodyHtml: `
        <div style="background-color:#F6F3EC;border:1px solid #EAE5DC;padding:18px 20px;font-family:Arial,sans-serif;font-size:13px;line-height:1.65;color:#4B463F;">
          Crafted silhouettes, sustainable mills, and small-batch garments—curated exclusively for members.
        </div>`,
    }),
  }
}

export const buildOrderConfirmationEmail = ({ order }) => {
  const addr = order.shippingAddress || {}
  const paymentRef = order.paymentDetails?.razorpayPaymentId
    ? ` · Ref ${escapeHtml(order.paymentDetails.razorpayPaymentId)}`
    : ''

  return {
    subject: `Order Confirmed · ${order.orderNumber}`,
    body: buildVeloraEmailShell({
      eyebrow: 'ORDER RECEIPT',
      title: `Thank you, ${order.customerName}`,
      intro: `We have received your payment and confirmed order ${order.orderNumber}. Your pieces are now in preparation at our atelier.`,
      bodyHtml: `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:20px;">
          ${buildOrderItemsRows(order.items)}
          <tr>
            <td style="padding:12px 0 4px;font-family:Arial,sans-serif;font-size:12px;color:#6D6860;">Subtotal</td>
            <td align="right" style="padding:12px 0 4px;font-family:Arial,sans-serif;font-size:12px;color:#1A1816;">${escapeHtml(formatINR(order.subtotal))}</td>
          </tr>
          <tr>
            <td style="padding:4px 0 12px;font-family:Arial,sans-serif;font-size:12px;color:#6D6860;">Shipping (${escapeHtml(order.deliveryMethod)})</td>
            <td align="right" style="padding:4px 0 12px;font-family:Arial,sans-serif;font-size:12px;color:#1A1816;">${order.shippingFee === 0 ? 'Complimentary' : escapeHtml(formatINR(order.shippingFee))}</td>
          </tr>
          <tr>
            <td style="padding:12px 0 0;border-top:1px solid #151413;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;color:#1A1816;">Total Paid</td>
            <td align="right" style="padding:12px 0 0;border-top:1px solid #151413;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;color:#1A1816;">${escapeHtml(formatINR(order.total))}</td>
          </tr>
        </table>
        <div style="background-color:#F6F3EC;border:1px solid #EAE5DC;padding:16px 20px;font-family:Arial,sans-serif;font-size:12px;line-height:1.7;color:#5E5951;">
          <strong style="color:#1A1816;">Shipping Destination:</strong><br/>
          ${escapeHtml(addr.recipient)}<br/>
          ${escapeHtml(addr.street)}<br/>
          ${escapeHtml(addr.city)}, ${escapeHtml(addr.region)} ${escapeHtml(addr.postalCode)}<br/>
          ${escapeHtml(addr.country)}<br/><br/>
          <strong style="color:#1A1816;">Payment:</strong> ${escapeHtml(order.paymentMethod || 'Razorpay')} (${escapeHtml(order.paymentStatus || 'Paid')})${paymentRef}
        </div>`,
    }),
  }
}

export const buildAdminNewOrderEmail = ({ order }) => ({
  subject: `New Order ${order.orderNumber} · ${formatINR(order.total)}`,
  body: buildVeloraEmailShell({
    eyebrow: 'ATELIER ADMIN ALERT',
    title: `New Paid Order ${order.orderNumber}`,
    intro: `${order.customerName} (${order.customerEmail}) placed an order via ${order.paymentMethod || 'Razorpay'}.`,
    bodyHtml: `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:16px;">
        ${buildOrderItemsRows(order.items)}
      </table>
      <div style="background-color:#F6F3EC;border:1px solid #EAE5DC;padding:14px 18px;font-family:Arial,sans-serif;font-size:12.5px;line-height:1.7;color:#4B463F;">
        <strong>Order Total:</strong> ${escapeHtml(formatINR(order.total))}<br/>
        <strong>Courier:</strong> ${escapeHtml(order.deliveryMethod)}<br/>
        <strong>Payment ID:</strong> ${escapeHtml(order.paymentDetails?.razorpayPaymentId || 'N/A')}
      </div>`,
  }),
})

const STATUS_DESCRIPTIONS = {
  'In Preparation':
    'Your pieces are currently being inspected, pressed, and prepared for dispatch.',
  Shipped:
    'Your order has left our atelier and is on its way via our courier partner.',
  Delivered:
    'Your order has been marked as delivered. We hope these pieces become enduring staples in your wardrobe.',
  Cancelled:
    'Your order has been cancelled. If a payment was captured, refund processing will be handled back to your original payment method.',
}

export const buildOrderStatusEmail = ({ order, previousStatus }) => ({
  subject: `Order ${order.orderNumber} · ${order.status}`,
  body: buildVeloraEmailShell({
    eyebrow: 'FULFILLMENT UPDATE',
    title: `Order Status: ${order.status}`,
    intro: `Hello ${order.customerName}, the fulfillment status for order ${order.orderNumber} has been updated${previousStatus ? ` from ${previousStatus}` : ''} to ${order.status}.`,
    bodyHtml: `
      <div style="background-color:#F6F3EC;border:1px solid #EAE5DC;padding:18px 20px;font-family:Arial,sans-serif;font-size:13px;line-height:1.7;color:#4B463F;margin-bottom:16px;">
        ${escapeHtml(STATUS_DESCRIPTIONS[order.status] || 'Please inspect your order receipt for the latest fulfillment details.')}
      </div>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#6D6860;">
        Courier Method: <strong style="color:#1A1816;">${escapeHtml(order.deliveryMethod)}</strong> · Order Total: <strong style="color:#1A1816;">${escapeHtml(formatINR(order.total))}</strong>
      </p>`,
  }),
})

export const buildContactConciergeEmail = ({ name, email, topic, message }) => ({
  subject: `Concierge Inquiry · ${topic}`,
  body: buildVeloraEmailShell({
    eyebrow: 'CONCIERGE INBOX',
    title: topic || 'New Client Inquiry',
    intro: `Submitted via the Velora Contact Us desk by ${name} (${email}).`,
    bodyHtml: `
      <div style="background-color:#F6F3EC;border:1px solid #EAE5DC;padding:18px 20px;font-family:Arial,sans-serif;font-size:13.5px;line-height:1.75;color:#1A1816;white-space:pre-wrap;">${escapeHtml(message)}</div>
      <p style="margin:14px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#6D6860;">
        Reply directly to: <strong style="color:#1A1816;">${escapeHtml(email)}</strong>
      </p>`,
  }),
})

export const buildContactAutoReplyEmail = ({ name, topic }) => ({
  subject: `We Received Your Inquiry · ${topic}`,
  body: buildVeloraEmailShell({
    eyebrow: 'CLIENT CONCIERGE',
    title: `Thank you for writing, ${name}`,
    intro: `Our atelier specialists have received your message regarding "${topic}" and will respond within one business day.`,
    bodyHtml: `
      <div style="background-color:#F6F3EC;border:1px solid #EAE5DC;padding:16px 20px;font-family:Arial,sans-serif;font-size:12.5px;line-height:1.7;color:#5E5951;">
        Concierge Hours: Monday – Saturday, 9:00 – 19:00 EST.
      </div>`,
  }),
})

export const buildNewProductAnnouncementEmail = ({
  product,
  storefrontOrigin = '',
}) => {
  const imageUrl =
    typeof product.image === 'string' && /^https?:\/\//i.test(product.image)
      ? product.image
      : ''
  const productUrl =
    storefrontOrigin && product.slug
      ? `${storefrontOrigin}/product/${encodeURIComponent(product.slug)}`
      : ''
  const sizesText =
    Array.isArray(product.sizes) && product.sizes.length > 0
      ? product.sizes.join(' · ')
      : 'One Size'

  return {
    subject: `New Arrival at Velora · ${product.name}`,
    body: buildVeloraEmailShell({
      eyebrow: 'NEW COLLECTION RELEASE',
      title: product.name,
      intro: `A new piece has just arrived in our ${(product.department || 'atelier').toUpperCase()} · ${product.category || 'COLLECTION'} assortment.`,
      bodyHtml: `
        ${
          imageUrl
            ? `<div style="margin-bottom:20px;text-align:center;">
                <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(product.name)}" style="max-width:100%;max-height:360px;object-fit:cover;border:1px solid #E5DFD3;" />
              </div>`
            : ''
        }
        <div style="background-color:#F6F3EC;border:1px solid #EAE5DC;padding:20px;font-family:Arial,sans-serif;font-size:13px;line-height:1.7;color:#4B463F;margin-bottom:20px;">
          <p style="margin:0 0 10px;font-size:16px;font-weight:bold;color:#1A1816;">
            ${escapeHtml(formatINR(product.price))}
          </p>
          <p style="margin:0 0 12px;color:#5E5951;">
            ${escapeHtml(product.description || 'Crafted in small batches at the Velora atelier.')}
          </p>
          ${
            product.fabric
              ? `<p style="margin:0 0 6px;"><strong>Material:</strong> ${escapeHtml(product.fabric)}</p>`
              : ''
          }
          <p style="margin:0 0 6px;"><strong>Available Sizes:</strong> ${escapeHtml(sizesText)}</p>
          <p style="margin:0;"><strong>Availability:</strong> ${
            product.stock > 0
              ? `${escapeHtml(product.stock)} piece(s) ready for dispatch`
              : 'Limited atelier allocation'
          }</p>
        </div>
        ${
          productUrl
            ? `<div style="text-align:center;">
                <a href="${escapeHtml(productUrl)}" style="display:inline-block;padding:12px 26px;background-color:#151413;color:#FCF9F2;text-decoration:none;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;">
                  EXPLORE PIECE
                </a>
              </div>`
            : ''
        }`,
    }),
  }
}

