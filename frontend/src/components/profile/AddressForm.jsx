import { useState } from 'react'

const EMPTY_FORM = {
  label: '',
  recipient: '',
  street: '',
  city: '',
  region: '',
  postalCode: '',
  country: 'United States',
  phone: '',
  isDefault: false,
}

const inputClass =
  'w-full min-w-0 bg-[#FCF9F2] border border-[#D8D1C5] px-3.5 py-2.5 text-[13px] text-[#1A1816] placeholder:text-[#969087] focus:border-[#1A1816] focus:outline-none transition-colors'

const labelClass =
  'block text-[10px] tracking-[0.18em] uppercase text-[#78736B] mb-1.5'

const AddressForm = ({ initialAddress, onSave, onCancel }) => {
  const [form, setForm] = useState(() =>
    initialAddress ? { ...EMPTY_FORM, ...initialAddress } : EMPTY_FORM,
  )

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#F6F3EC] border border-[#EAE5DC] p-5 sm:p-7 space-y-5 mb-8"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-serif text-[22px] font-normal text-[#1A1816]">
          {initialAddress ? 'Edit Address' : 'Add New Address'}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="addr-label" className={labelClass}>
            Address Label
          </label>
          <input
            id="addr-label"
            type="text"
            required
            value={form.label}
            onChange={(e) => handleChange('label', e.target.value)}
            placeholder="e.g. Primary Residence"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="addr-recipient" className={labelClass}>
            Recipient Name
          </label>
          <input
            id="addr-recipient"
            type="text"
            required
            value={form.recipient}
            onChange={(e) => handleChange('recipient', e.target.value)}
            placeholder="Full name"
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="addr-street" className={labelClass}>
            Street Address
          </label>
          <input
            id="addr-street"
            type="text"
            required
            value={form.street}
            onChange={(e) => handleChange('street', e.target.value)}
            placeholder="Street, apartment, or suite"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="addr-city" className={labelClass}>
            City
          </label>
          <input
            id="addr-city"
            type="text"
            required
            value={form.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="addr-region" className={labelClass}>
            State / Region
          </label>
          <input
            id="addr-region"
            type="text"
            required
            value={form.region}
            onChange={(e) => handleChange('region', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="addr-postal" className={labelClass}>
            Postal Code
          </label>
          <input
            id="addr-postal"
            type="text"
            required
            value={form.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="addr-country" className={labelClass}>
            Country
          </label>
          <input
            id="addr-country"
            type="text"
            required
            value={form.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="addr-phone" className={labelClass}>
            Phone Number
          </label>
          <input
            id="addr-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (212) 555-0184"
            className={inputClass}
          />
        </div>
      </div>

      <label className="inline-flex items-center gap-2.5 text-[12.5px] text-[#4B463F] cursor-pointer">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => handleChange('isDefault', e.target.checked)}
          className="accent-[#151413]"
        />
        <span>Set as default shipping address</span>
      </label>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          className="px-6 py-3 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors cursor-pointer"
        >
          SAVE ADDRESS
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-[#CFC9BE] text-[10.5px] font-medium tracking-[0.2em] uppercase text-[#1A1816] hover:border-[#1A1816] transition-colors cursor-pointer"
        >
          CANCEL
        </button>
      </div>
    </form>
  )
}

export default AddressForm

