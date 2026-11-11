import { Link } from 'react-router-dom'
import { RiKey2Line } from '@remixicon/react'

const ClerkSetupNotice = ({ mode = 'sign-in' }) => {
  return (
    <div className="border border-[#E5DFD3] bg-[#FCF9F2] p-6 sm:p-8">
      <div className="w-10 h-10 rounded-full bg-[#F3EFE6] text-[#1A1816] flex items-center justify-center mb-4">
        <RiKey2Line size={18} aria-hidden="true" />
      </div>

      <p className="text-[10px] tracking-[0.22em] uppercase text-[#8A8379] mb-1.5">
        CLERK CONFIGURATION REQUIRED
      </p>
      <h2 className="font-serif text-[24px] font-normal text-[#1A1816] mb-3">
        Connect your Clerk Publishable Key
      </h2>
      <p className="text-[13px] leading-[1.7] text-[#5E5951] mb-5">
        Add your Clerk key to{' '}
        <code className="px-1.5 py-0.5 bg-[#F3EFE6] text-[#1A1816] text-[12px]">
          frontend/.env
        </code>{' '}
        to activate the interactive Clerk{' '}
        {mode === 'sign-up' ? 'Sign Up' : 'Sign In'} flow:
      </p>

      <pre className="bg-[#F6F3EC] border border-[#E5DFD3] p-3.5 text-[11.5px] text-[#1A1816] overflow-x-auto mb-6">
        VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
      </pre>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/profile"
          className="px-6 py-3 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors"
        >
          CONTINUE AS GUEST
        </Link>
        <Link
          to="/shop"
          className="px-6 py-3 border border-[#CFC9BE] text-[10.5px] font-medium tracking-[0.2em] uppercase text-[#1A1816] hover:border-[#1A1816] transition-colors"
        >
          BROWSE SHOP
        </Link>
      </div>
    </div>
  )
}

export default ClerkSetupNotice

