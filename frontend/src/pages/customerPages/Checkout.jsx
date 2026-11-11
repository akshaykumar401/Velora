import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RiArrowLeftLine, RiShoppingBagLine } from '@remixicon/react'
import { CheckoutForm, CheckoutSummary } from '../../components/checkout'
import { useStore } from '../../features/store/storeContext.js'

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, cartSubtotal, profile, addresses, placeOrder } = useStore()

  const defaultAddr =
    addresses.find((addr) => addr.isDefault) || addresses[0] || null

  const [selectedDelivery, setSelectedDelivery] = useState('standard')
  const [formData, setFormData] = useState(() => ({
    recipient: defaultAddr?.recipient || profile.fullName || '',
    email: profile.email || '',
    phone: defaultAddr?.phone || profile.phone || '',
    street: defaultAddr?.street || '',
    city: defaultAddr?.city || '',
    region: defaultAddr?.region || '',
    postalCode: defaultAddr?.postalCode || '',
    country: defaultAddr?.country || 'United States',
    cardName: profile.fullName || '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  }))

  const shippingFee =
    selectedDelivery === 'express' && cartSubtotal < 400 ? 25 : 0

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
      country: addr.country || 'United States',
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (cartItems.length === 0) return

    const digits = formData.cardNumber.replace(/\D/g, '')
    const paymentLast4 = digits.length >= 4 ? digits.slice(-4) : '4242'

    const order = placeOrder({
      shippingAddress: {
        recipient: formData.recipient,
        street: formData.street,
        city: formData.city,
        region: formData.region,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      deliveryMethod:
        selectedDelivery === 'express'
          ? 'Express Priority Air'
          : 'Standard Atelier Courier',
      shippingFee,
      paymentLast4,
    })

    navigate(`/orders/${order.id}`)
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
              onSubmit={handleSubmit}
            />
          </div>

          <div className="lg:col-span-5 min-w-0">
            <CheckoutSummary
              items={cartItems}
              subtotal={cartSubtotal}
              shippingFee={shippingFee}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Checkout
