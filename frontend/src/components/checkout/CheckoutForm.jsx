import { RiBankCardLine, RiShieldCheckLine, RiTruckLine } from '@remixicon/react'

const DELIVERY_OPTIONS = [
  {
    id: 'standard',
    label: 'Standard Atelier Courier',
    eta: '3–5 Business Days',
    fee: 0,
  },
  {
    id: 'express',
    label: 'Express Priority Air',
    eta: '1–2 Business Days',
    fee: 25,
  },
]

const inputClass =
  'w-full min-w-0 bg-[#FCF9F2] border border-[#D8D1C5] px-3.5 py-2.5 text-[13px] text-[#1A1816] placeholder:text-[#969087] focus:border-[#1A1816] focus:outline-none transition-colors'

const labelClass =
  'block text-[10px] tracking-[0.18em] uppercase text-[#78736B] mb-1.5'

const CheckoutForm = ({
  addresses = [],
  formData,
  onFieldChange,
  onSelectAddress,
  selectedDelivery,
  onDeliveryChange,
  subtotal,
  onSubmit,
}) => {
  return (
    <form
      id="velora-checkout-form"
      onSubmit={onSubmit}
      className="space-y-10 min-w-0"
    >
      {/* Saved Address Quick Selector */}
      {addresses.length > 0 && (
        <div>
          <p className="text-[10px] tracking-[0.22em] uppercase text-[#8A8379] mb-3">
            SAVED ADDRESSES
          </p>
          <div className="flex flex-wrap gap-2.5">
            {addresses.map((addr) => (
              <button
                key={addr.id}
                type="button"
                onClick={() => onSelectAddress(addr)}
                className="px-3.5 py-2 border border-[#D8D1C5] bg-[#F6F3EC] hover:border-[#1A1816] text-left transition-colors cursor-pointer"
              >
                <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-[#1A1816]">
                  {addr.label}
                </span>
                <span className="block text-[11.5px] text-[#6D6860] truncate max-w-[220px]">
                  {addr.street}, {addr.city}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Shipping Information */}
      <div>
        <h2 className="font-serif text-[22px] font-normal text-[#1A1816] mb-5">
          Shipping Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="checkout-recipient" className={labelClass}>
              Full Name
            </label>
            <input
              id="checkout-recipient"
              type="text"
              required
              value={formData.recipient}
              onChange={(e) => onFieldChange('recipient', e.target.value)}
              placeholder="Recipient full name"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="checkout-email" className={labelClass}>
              Email Address
            </label>
            <input
              id="checkout-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => onFieldChange('email', e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="checkout-phone" className={labelClass}>
              Phone Number
            </label>
            <input
              id="checkout-phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => onFieldChange('phone', e.target.value)}
              placeholder="+1 (212) 555-0184"
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="checkout-street" className={labelClass}>
              Street Address
            </label>
            <input
              id="checkout-street"
              type="text"
              required
              value={formData.street}
              onChange={(e) => onFieldChange('street', e.target.value)}
              placeholder="Street, apartment, or suite"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="checkout-city" className={labelClass}>
              City
            </label>
            <input
              id="checkout-city"
              type="text"
              required
              value={formData.city}
              onChange={(e) => onFieldChange('city', e.target.value)}
              placeholder="City"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="checkout-region" className={labelClass}>
              State / Region
            </label>
            <input
              id="checkout-region"
              type="text"
              required
              value={formData.region}
              onChange={(e) => onFieldChange('region', e.target.value)}
              placeholder="State or province"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="checkout-postal" className={labelClass}>
              Postal Code
            </label>
            <input
              id="checkout-postal"
              type="text"
              required
              value={formData.postalCode}
              onChange={(e) => onFieldChange('postalCode', e.target.value)}
              placeholder="Postal code"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="checkout-country" className={labelClass}>
              Country
            </label>
            <input
              id="checkout-country"
              type="text"
              required
              value={formData.country}
              onChange={(e) => onFieldChange('country', e.target.value)}
              placeholder="Country"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Delivery Method */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <RiTruckLine size={17} className="text-[#1A1816]" aria-hidden="true" />
          <h2 className="font-serif text-[22px] font-normal text-[#1A1816]">
            Delivery Method
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {DELIVERY_OPTIONS.map((option) => {
            const effectiveFee =
              option.id === 'express' && subtotal >= 400 ? 0 : option.fee
            const active = selectedDelivery === option.id
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onDeliveryChange(option.id)}
                aria-pressed={active}
                className={`p-4 border text-left transition-colors cursor-pointer ${
                  active
                    ? 'border-[#1A1816] bg-[#F6F3EC]'
                    : 'border-[#D8D1C5] bg-transparent hover:border-[#8A8379]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[12.5px] font-medium text-[#1A1816]">
                    {option.label}
                  </span>
                  <span className="text-[12px] font-medium text-[#1A1816] shrink-0">
                    {effectiveFee === 0 ? 'Complimentary' : `$${effectiveFee}`}
                  </span>
                </div>
                <p className="text-[11.5px] text-[#6D6860]">{option.eta}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Payment Details */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <RiBankCardLine size={17} className="text-[#1A1816]" aria-hidden="true" />
          <h2 className="font-serif text-[22px] font-normal text-[#1A1816]">
            Payment
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F6F3EC] p-5 border border-[#EAE5DC]">
          <div className="sm:col-span-2">
            <label htmlFor="checkout-card-name" className={labelClass}>
              Name on Card
            </label>
            <input
              id="checkout-card-name"
              type="text"
              required
              value={formData.cardName}
              onChange={(e) => onFieldChange('cardName', e.target.value)}
              placeholder="Cardholder name"
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="checkout-card-number" className={labelClass}>
              Card Number
            </label>
            <input
              id="checkout-card-number"
              type="text"
              inputMode="numeric"
              required
              value={formData.cardNumber}
              onChange={(e) => onFieldChange('cardNumber', e.target.value)}
              placeholder="4242 4242 4242 4242"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="checkout-card-expiry" className={labelClass}>
              Expiration (MM/YY)
            </label>
            <input
              id="checkout-card-expiry"
              type="text"
              required
              value={formData.cardExpiry}
              onChange={(e) => onFieldChange('cardExpiry', e.target.value)}
              placeholder="09/28"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="checkout-card-cvc" className={labelClass}>
              Security Code
            </label>
            <input
              id="checkout-card-cvc"
              type="text"
              inputMode="numeric"
              required
              value={formData.cardCvc}
              onChange={(e) => onFieldChange('cardCvc', e.target.value)}
              placeholder="123"
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-2 text-[11.5px] text-[#6D6860] pt-1">
            <RiShieldCheckLine size={15} className="shrink-0" aria-hidden="true" />
            <span>Encrypted client-side checkout preview.</span>
          </div>
        </div>
      </div>
    </form>
  )
}

export default CheckoutForm

