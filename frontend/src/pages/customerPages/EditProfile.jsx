import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RiCheckLine } from '@remixicon/react'
import { ProfileLayout } from '../../components/profile'
import { useStore } from '../../features/store/storeContext.js'

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL']

const inputClass =
  'w-full min-w-0 bg-[#FCF9F2] border border-[#D8D1C5] px-3.5 py-2.5 text-[13px] text-[#1A1816] placeholder:text-[#969087] focus:border-[#1A1816] focus:outline-none transition-colors'

const labelClass =
  'block text-[10px] tracking-[0.18em] uppercase text-[#78736B] mb-1.5'

const EditProfile = () => {
  const { profile, updateProfile } = useStore()
  const [form, setForm] = useState(profile)
  const [saved, setSaved] = useState(false)

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (saved) setSaved(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProfile(form)
    setSaved(true)
  }

  return (
    <ProfileLayout
      title="Edit Profile"
      subtitle="Update your contact preferences and preferred garment sizing."
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-[640px] border border-[#E5DFD3] bg-[#F6F3EC] p-5 sm:p-8 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="profile-name" className={labelClass}>
              Full Name
            </label>
            <input
              id="profile-name"
              type="text"
              required
              value={form.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="profile-email" className={labelClass}>
              Email Address
            </label>
            <input
              id="profile-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="profile-phone" className={labelClass}>
              Phone Number
            </label>
            <input
              id="profile-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="profile-size" className={labelClass}>
              Preferred Fit Size
            </label>
            <select
              id="profile-size"
              value={form.preferredSize}
              onChange={(e) => handleChange('preferredSize', e.target.value)}
              className={inputClass}
            >
              {SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="inline-flex items-center gap-2.5 text-[12.5px] text-[#4B463F] cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(form.newsletterOptIn)}
            onChange={(e) => handleChange('newsletterOptIn', e.target.checked)}
            className="accent-[#151413]"
          />
          <span>Receive Velora Circle seasonal invitations and previews</span>
        </label>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors cursor-pointer"
          >
            {saved ? (
              <>
                <RiCheckLine size={15} aria-hidden="true" />
                <span>CHANGES SAVED</span>
              </>
            ) : (
              <span>SAVE PROFILE</span>
            )}
          </button>

          <Link
            to="/profile"
            className="px-6 py-3.5 border border-[#CFC9BE] text-[10.5px] font-medium tracking-[0.2em] uppercase text-[#1A1816] hover:border-[#1A1816] transition-colors"
          >
            BACK TO OVERVIEW
          </Link>
        </div>
      </form>
    </ProfileLayout>
  )
}

export default EditProfile
