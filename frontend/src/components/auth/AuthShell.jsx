import { Link } from 'react-router-dom'
import { RiCheckLine, RiShieldCheckLine } from '@remixicon/react'
import BrandLogo from '../section/BrandLogo.jsx'

const MEMBERSHIP_NOTES = [
  'Private early access to seasonal Velora capsule collections',
  'Synchronized wishlist, saved addresses, and atelier order receipts',
  'Complimentary carbon-neutral courier delivery & 30-day returns',
]

const AuthShell = ({
  eyebrow = 'CLIENT MEMBERSHIP',
  title,
  subtitle,
  switchPrompt,
  switchLabel,
  switchTo,
  switchState,
  children,
}) => {
  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-[#FCF9F2]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Editorial Brand Panel */}
          <div className="lg:col-span-5 bg-[#F6F3EC] border border-[#EAE5DC] p-7 sm:p-10 lg:p-12 min-w-0">
            <Link to="/" aria-label="Velora Home" className="inline-block mb-8">
              <BrandLogo size="lg" showTagline />
            </Link>

            <p className="text-[10px] tracking-[0.26em] uppercase text-[#8A8379] mb-2.5">
              {eyebrow}
            </p>
            <h1 className="font-serif text-[30px] sm:text-[38px] font-normal text-[#1A1816] leading-[1.12] mb-4">
              {title}
            </h1>
            <p className="text-[13px] leading-[1.75] text-[#5E5951] mb-8">
              {subtitle}
            </p>

            <ul className="space-y-3.5 border-t border-[#E5DFD3] pt-6">
              {MEMBERSHIP_NOTES.map((note) => (
                <li
                  key={note}
                  className="flex items-start gap-2.5 text-[12.5px] leading-[1.6] text-[#4B463F]"
                >
                  <RiCheckLine
                    size={16}
                    className="text-[#1A1816] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{note}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-5 border-t border-[#E5DFD3] flex items-center gap-2 text-[11.5px] text-[#78736B]">
              <RiShieldCheckLine size={15} className="shrink-0" aria-hidden="true" />
              <span>Protected by Clerk authentication</span>
            </div>
          </div>

          {/* Clerk Form Container */}
          <div className="lg:col-span-7 flex flex-col items-center min-w-0">
            <div className="w-full max-w-[440px] min-w-0">{children}</div>

            {switchTo && (
              <p className="mt-6 text-[12.5px] text-[#6D6860] text-center">
                {switchPrompt}{' '}
                <Link
                  to={switchTo}
                  state={switchState}
                  className="text-[#1A1816] font-medium underline underline-offset-4 hover:opacity-75 transition-opacity"
                >
                  {switchLabel}
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AuthShell

