import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  RiArrowLeftLine,
  RiEyeLine,
  RiEyeOffLine,
  RiShieldKeyholeLine,
} from '@remixicon/react'
import BrandLogo from '../../components/section/BrandLogo.jsx'
import { ADMIN_DEMO_CREDENTIALS } from '../../data/adminData.js'
import { useAdmin } from '../../features/admin/adminContext.js'

const inputClass =
  'w-full min-w-0 bg-[#FCF9F2] border border-[#D8D1C5] px-3.5 py-2.5 text-[13px] text-[#1A1816] placeholder:text-[#969087] focus:border-[#1A1816] focus:outline-none transition-colors'

const labelClass =
  'block text-[10px] tracking-[0.18em] uppercase text-[#78736B] mb-1.5'

const AdminAuth = () => {
  const { isAuthenticated, loginAdmin } = useAdmin()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/admin'

  const [email, setEmail] = useState('')
  const [passcode, setPasscode] = useState('')
  const [showPasscode, setShowPasscode] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const res = loginAdmin({ email, passcode })
    if (!res.ok) {
      setError(res.error)
      return
    }
    navigate(redirectTo, { replace: true })
  }

  const handleFillDemo = () => {
    setEmail(ADMIN_DEMO_CREDENTIALS.email)
    setPasscode(ADMIN_DEMO_CREDENTIALS.passcode)
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#FCF9F2] text-[#1A1816] flex flex-col justify-between px-4 sm:px-8 py-8 overflow-x-clip">
      <div className="max-w-[1200px] w-full mx-auto flex items-center justify-between gap-4">
        <Link to="/" aria-label="Return to Velora Storefront">
          <BrandLogo />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.16em] uppercase text-[#5E5951] hover:text-[#1A1816] transition-colors"
        >
          <RiArrowLeftLine size={14} aria-hidden="true" />
          <span>STOREFRONT</span>
        </Link>
      </div>

      <div className="w-full max-w-[440px] mx-auto my-10">
        <div className="bg-[#F6F3EC] border border-[#EAE5DC] p-6 sm:p-9">
          <div className="w-10 h-10 rounded-full bg-[#151413] text-[#FCF9F2] flex items-center justify-center mb-5">
            <RiShieldKeyholeLine size={18} aria-hidden="true" />
          </div>

          <p className="text-[10px] tracking-[0.24em] uppercase text-[#8A8379] mb-1.5">
            ATELIER ADMINISTRATION
          </p>
          <h1 className="font-serif text-[28px] sm:text-[32px] font-normal text-[#1A1816] leading-tight mb-2">
            Admin Sign In
          </h1>
          <p className="text-[12.5px] leading-[1.65] text-[#666058] mb-6">
            Enter your administrator email and passcode to access catalog,
            order fulfillment, and review controls.
          </p>

          {error && (
            <div
              role="alert"
              className="mb-5 px-3.5 py-2.5 bg-[#EFE3DF] border border-[#C9A69C] text-[12px] text-[#6B2D22]"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className={labelClass}>
                Administrator Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError('')
                }}
                placeholder="admin@velora.com"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="admin-passcode" className={labelClass}>
                Admin Passcode
              </label>
              <div className="relative flex items-center">
                <input
                  id="admin-passcode"
                  type={showPasscode ? 'text' : 'password'}
                  required
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value)
                    if (error) setError('')
                  }}
                  placeholder="Enter admin passcode"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode((prev) => !prev)}
                  aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
                  className="absolute right-3 text-[#6D6860] hover:text-[#1A1816] cursor-pointer"
                >
                  {showPasscode ? (
                    <RiEyeOffLine size={16} aria-hidden="true" />
                  ) : (
                    <RiEyeLine size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3.5 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.22em] uppercase hover:bg-[#2B2825] transition-colors cursor-pointer"
            >
              SIGN IN TO ADMIN
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E5DFD3] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11.5px] text-[#6D6860]">
            <span>
              Demo: <code className="text-[#1A1816]">{ADMIN_DEMO_CREDENTIALS.email}</code>
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-left sm:text-right text-[10.5px] tracking-[0.14em] uppercase text-[#1A1816] underline underline-offset-4 hover:opacity-70 cursor-pointer"
            >
              Fill Demo Credentials
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-[11.5px] text-[#857F76]">
        &copy; {new Date().getFullYear()} Velora Atelier Console
      </p>
    </div>
  )
}

export default AdminAuth

