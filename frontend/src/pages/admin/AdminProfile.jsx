import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiCheckLine, RiLogoutBoxRLine, RiShieldCheckLine } from '@remixicon/react'
import { AdminPageHeader } from '../../components/admin'
import { useAdmin } from '../../features/admin/adminContext.js'

const inputClass =
  'w-full min-w-0 bg-[#FCF9F2] border border-[#D8D1C5] px-3.5 py-2.5 text-[13px] text-[#1A1816] placeholder:text-[#969087] focus:border-[#1A1816] focus:outline-none transition-colors'

const labelClass =
  'block text-[10px] tracking-[0.18em] uppercase text-[#78736B] mb-1.5'

const AdminProfile = () => {
  const { adminProfile, updateAdminProfile, logoutAdmin } = useAdmin()
  const navigate = useNavigate()
  const [draft, setDraft] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const form = draft ?? adminProfile

  const handleChange = (field, value) => {
    setDraft((prev) => ({ ...(prev ?? adminProfile), [field]: value }))
    if (saved) setSaved(false)
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      await updateAdminProfile({
        name: form.name,
        role: form.role,
        email: form.email,
        studio: form.studio,
        phone: form.phone,
      })
      setDraft(null)
      setSaved(true)
    } catch (err) {
      setError(err?.message || 'Failed to update administrator profile')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = () => {
    logoutAdmin()
    navigate('/admin/login')
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="OPERATOR SETTINGS"
        title="Admin Profile"
        subtitle="Manage your administrator display details and active console session."
        action={
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-5 py-3 border border-[#CFC9BE] text-[10.5px] font-medium tracking-[0.2em] uppercase text-[#1A1816] hover:border-[#1A1816] transition-colors cursor-pointer"
          >
            <RiLogoutBoxRLine size={14} aria-hidden="true" />
            <span>SIGN OUT</span>
          </button>
        }
      />

      <div className="max-w-[660px] space-y-6">
        {error && (
          <div
            role="alert"
            className="bg-[#EFE3DF] border border-[#C9A69C] px-4 py-3 text-[13px] text-[#6B2D22]"
          >
            {error}
          </div>
        )}

        <div className="bg-[#F6F3EC] border border-[#EAE5DC] p-5 flex items-center gap-3 text-[12.5px] text-[#5E5951]">
          <RiShieldCheckLine size={17} className="text-[#1A1816] shrink-0" aria-hidden="true" />
          <span>
            Authenticated session active for{' '}
            <strong className="text-[#1A1816]">
              {adminProfile.authEmail || adminProfile.email}
            </strong>
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#F6F3EC] border border-[#EAE5DC] p-5 sm:p-8 space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="admin-prof-name" className={labelClass}>
                Administrator Name
              </label>
              <input
                id="admin-prof-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="admin-prof-role" className={labelClass}>
                Role Title
              </label>
              <input
                id="admin-prof-role"
                type="text"
                required
                value={form.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="admin-prof-email" className={labelClass}>
                Contact Email
              </label>
              <input
                id="admin-prof-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="admin-prof-phone" className={labelClass}>
                Direct Phone
              </label>
              <input
                id="admin-prof-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="admin-prof-studio" className={labelClass}>
                Atelier Studio Location
              </label>
              <input
                id="admin-prof-studio"
                type="text"
                value={form.studio}
                onChange={(e) => handleChange('studio', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors disabled:opacity-60 cursor-pointer"
          >
            {saving ? (
              <span>SAVING...</span>
            ) : saved ? (
              <>
                <RiCheckLine size={15} aria-hidden="true" />
                <span>PROFILE SAVED</span>
              </>
            ) : (
              <span>UPDATE PROFILE</span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminProfile

