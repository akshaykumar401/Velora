import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RiArrowLeftLine, RiShoppingBagLine } from '@remixicon/react'
import { useAppDispatch } from '../../App/hooks.js'
import { CheckoutForm, CheckoutSummary } from '../../components/checkout'
import { fetchCatalog } from '../../features/catalog/catalogSlice.js'
import { useStore } from '../../features/store/storeContext.js'
import { customerApi } from '../../services/customerApi.js'
import {
  EXPRESS_SHIPPING_FEE_INR,
  EXPRESS_SHIPPING_THRESHOLD_INR,
} from '../../utils/currency.js'
import {
  loadRazorpayScript,
  openRazorpayCheckout,
} from '../../utils/razorpay.js'

const Checkout = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { cartItems, cartSubtotal, profile, addresses, placeOrder } = useStore()

  const defaultAddr =
    addresses.find((addr) => addr.isDefault) || addresses[0] || null

  const [selectedDelivery, setSelectedDelivery] = useState('standard')
  const [submitError, setSubmitError] = useState('')
  const [submitNotice, setSubmitNotice] = useState('')
  const [paymentStage, setPaymentStage] = useState('idle')
  const [razorpayConfigured, setRazorpayConfigured] = useState(null)
  const [pendingVerification, setPendingVerification] = useState(null)

  const [formData, setFormData] = useState(() => ({
    recipient: defaultAddr?.recipient || profile.fullName || '',
    email: profile.email || '',
    phone: defaultAddr?.phone || profile.phone || '',
    street: defaultAddr?.street || '',
    city: defaultAddr?.city || '',
    region: defaultAddr?.region || '',
    postalCode: defaultAddr?.postalCode || '',
    country: defaultAddr?.country || 'India',
  }))

  useEffect(() => {
    let active = true
    customerApi
      .getPaymentConfig()
      .then((config) => {
        if (active && typeof config?.configured === 'boolean') {
          setRazorpayConfigured(config.configured)
        }
      })
      .catch(() => {
        // Leave null if config probe is blocked; actual payment attempt surfaces exact error
      })

    return () => {
      active = false
    }
  }, [])

  const shippingFee =
    selectedDelivery === 'express' && cartSubtotal < EXPRESS_SHIPPING_THRESHOLD_INR
      ? EXPRESS_SHIPPING_FEE_INR
      : 0

  const deliveryMethod =
    selectedDelivery === 'express'
      ? 'Express Priority Air'
      : 'Standard Atelier Courier'

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSelectAddress = (addr) => {
    setFormData((prev) => ({
      ...prev,
      recipient: addr.recipient || prev.recipient,
      phone: addr.phone || prev.phone,
      street: addr.street || '',
      city: addr.city || '',
      region: addr.region || '',
      postalCode: addr.postalCode || '',
      country: addr.country || 'India',
    }))
  }

  const confirmPaidOrder = async (verificationPayload) => {
    setPaymentStage('verifying')
    const order = await placeOrder(verificationPayload)
    setPendingVerification(null)
    dispatch(fetchCatalog())
    if (order?.id) {
      navigate(`/orders/${order.id}`)
    }
  }

  const handleRetryVerification = async () => {
    if (!pendingVerification || paymentStage !== 'idle') return
    setSubmitError('')
    setSubmitNotice('')
    try {
      await confirmPaidOrder(pendingVerification)
    } catch (err) {
      setSubmitError(
        err?.message ||
          `Unable to verify payment ${pendingVerification.razorpayPaymentId}. Please try again.`,
      )
    } finally {
      setPaymentStage('idle')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (cartItems.length === 0 || paymentStage !== 'idle') return
    setSubmitError('')
    setSubmitNotice('')

    const shippingAddress = {
      recipient: formData.recipient,
      street: formData.street,
      city: formData.city,
      region: formData.region,
      postalCode: formData.postalCode,
      country: formData.country,
    }

    try {
      if (
        pendingVerification &&
        pendingVerification.deliveryMethod === deliveryMethod
      ) {
        await confirmPaidOrder({
          ...pendingVerification,
          shippingAddress,
        })
        return
      }

      setPaymentStage('creating')
      const [scriptLoaded, rzpOrder] = await Promise.all([
        loadRazorpayScript(),
        customerApi.createRazorpayOrder({
          shippingAddress,
          deliveryMethod,
        }),
      ])

      if (!scriptLoaded) {
        throw new Error(
          'Unable to load Razorpay Checkout. Check your internet connection or disable script blockers.',
        )
      }

      const keyId = rzpOrder.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || ''
      if (!keyId || !rzpOrder.razorpayOrderId) {
        throw new Error('Incomplete Razorpay initialization response from server.')
      }

      setPaymentStage('checkout')
      const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
      const paymentResult = await openRazorpayCheckout({
        keyId,
        razorpayOrderId: rzpOrder.razorpayOrderId,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency || 'INR',
        name: 'VELORA',
        description: `Atelier Order · ${itemCount} ${itemCount === 1 ? 'Piece' : 'Pieces'}`,
        prefill: {
          name: formData.recipient,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          customerName: formData.recipient,
          deliveryMethod,
        },
      })

      const verificationPayload = {
        ...paymentResult,
        shippingAddress,
        deliveryMethod,
      }
      setPendingVerification(verificationPayload)
      await confirmPaidOrder(verificationPayload)
    } catch (err) {
      if (err?.code === 'PAYMENT_CANCELLED') {
        setSubmitNotice(
          'Payment window closed. Your shopping bag and delivery address remain saved.',
        )
      } else {
        setSubmitError(
          err?.message || 'Unable to complete Razorpay payment. Please try again.',
        )
      }
    } finally {
      setPaymentStage('idle')
    }
  }

  if (cartItems.length === 0) {
    return (
      <section className="py-20 sm:py-28 bg-[#FCF9F2]">
        <div className="max-w-[480px] mx-auto px-4 text-center">
          <div className="w-12 h-12 rounded-full bg-[#F3EFE6] text-[#5E5951] flex items-center justify-center mx-auto mb-5">
            <RiShoppingBagLine size={20} aria-hidden="true" />
          </div>
          <p className="text-[10px] tracking-[0.24em] uppercase text-[#8A8379] mb-2">
            CHECKOUT
          </p>
          <h1 className="font-serif text-[30px] text-[#1A1816] mb-3">
            Your shopping bag is empty
          </h1>
          <p className="text-[13px] leading-[1.7] text-[#6D6860] mb-8">
            Select pieces from our collection before proceeding to checkout.
          </p>
          <Link
            to="/shop"
            className="inline-block px-7 py-3.5 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors"
          >
            EXPLORE COLLECTION
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-[#FCF9F2]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#EAE5DC]">
          <div>
            <p className="text-[10px] tracking-[0.26em] uppercase text-[#8A8379] mb-1.5">
              ATELIER DISPATCH
            </p>
            <h1 className="font-serif text-[32px] sm:text-[40px] font-normal text-[#1A1816] leading-tight">
              Checkout
            </h1>
          </div>

          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-[#4B463F] hover:text-[#1A1816] transition-colors"
          >
            <RiArrowLeftLine size={14} aria-hidden="true" />
            <span>RETURN TO BAG</span>
          </Link>
        </div>

        {submitNotice && (
          <div
            role="status"
            className="mt-6 px-4 py-3 bg-[#F6F3EC] border border-[#D8D1C5] text-[12.5px] text-[#4B463F]"
          >
            {submitNotice}
          </div>
        )}

        {submitError && (
          <div
            role="alert"
            className="mt-6 px-4 py-3 bg-[#EFE3DF] border border-[#C9A69C] text-[12.5px] text-[#6B2D22] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <span>{submitError}</span>
            {pendingVerification && (
              <button
                type="button"
                onClick={handleRetryVerification}
                disabled={paymentStage !== 'idle'}
                className="px-4 py-2 bg-[#151413] text-[#FCF9F2] text-[10px] tracking-[0.18em] uppercase shrink-0 hover:bg-[#2B2825] disabled:opacity-50 cursor-pointer"
              >
                RETRY CONFIRMATION
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pt-8">
          <div className="lg:col-span-7 min-w-0">
            <CheckoutForm
              addresses={addresses}
              formData={formData}
              onFieldChange={handleFieldChange}
              onSelectAddress={handleSelectAddress}
              selectedDelivery={selectedDelivery}
              onDeliveryChange={setSelectedDelivery}
              subtotal={cartSubtotal}
              razorpayConfigured={razorpayConfigured}
              onSubmit={handleSubmit}
            />
          </div>

          <div className="lg:col-span-5 min-w-0">
            <CheckoutSummary
              items={cartItems}
              subtotal={cartSubtotal}
              shippingFee={shippingFee}
              paymentStage={paymentStage}
              razorpayConfigured={razorpayConfigured}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Checkout
