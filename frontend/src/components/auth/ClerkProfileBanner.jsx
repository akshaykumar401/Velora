import { Link } from 'react-router-dom'
import { Show, SignOutButton, useUser } from '@clerk/react'
import { RiLogoutBoxRLine, RiShieldCheckLine } from '@remixicon/react'
import { isClerkConfigured } from '../../features/auth/clerkConfig.js'

const SignedInClerkCard = () => {
  const { user } = useUser()

  return (
    <div className="bg-[#F6F3EC] border border-[#EAE5DC] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        {user?.imageUrl && (
          <img
            src={user.imageUrl}
            alt={user.fullName || 'Account avatar'}
            className="w-12 h-12 rounded-full object-cover border border-[#D8D1C5] shrink-0"
          />
        )}
        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8379] mb-0.5 flex items-center gap-1.5">
            <RiShieldCheckLine size={12} aria-hidden="true" />
            <span>CLERK VERIFIED MEMBER</span>
          </p>
          <p className="font-serif text-[20px] text-[#1A1816] truncate">
            {user?.fullName || user?.username || 'Velora Member'}
          </p>
          <p className="text-[12.5px] text-[#666058] truncate">
            {user?.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>

      <SignOutButton>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#CFC9BE] text-[10.5px] font-medium tracking-[0.18em] uppercase text-[#1A1816] hover:border-[#1A1816] transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RiLogoutBoxRLine size={14} aria-hidden="true" />
          <span>SIGN OUT</span>
        </button>
      </SignOutButton>
    </div>
  )
}

const ClerkProfileBanner = () => {
  if (!isClerkConfigured) {
    return (
      <div className="bg-[#F6F3EC] border border-[#EAE5DC] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8379] mb-1">
            AUTHENTICATION
          </p>
          <p className="text-[13px] text-[#5E5951]">
            Configure <code className="text-[#1A1816]">VITE_CLERK_PUBLISHABLE_KEY</code>{' '}
            to sign in with Clerk and sync your profile.
          </p>
        </div>
        <Link
          to="/sign-in"
          className="px-5 py-2.5 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors self-start sm:self-auto shrink-0"
        >
          SIGN IN PAGE
        </Link>
      </div>
    )
  }

  return (
    <>
      <Show when="signed-in">
        <SignedInClerkCard />
      </Show>

      <Show when="signed-out">
        <div className="bg-[#F6F3EC] border border-[#EAE5DC] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8379] mb-1">
              GUEST SESSION
            </p>
            <p className="text-[13px] text-[#5E5951]">
              Sign in with Clerk to access your verified Velora client session.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Link
              to="/sign-in"
              className="px-5 py-2.5 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors"
            >
              SIGN IN
            </Link>
            <Link
              to="/sign-up"
              className="px-5 py-2.5 border border-[#CFC9BE] text-[#1A1816] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:border-[#1A1816] transition-colors"
            >
              CREATE ACCOUNT
            </Link>
          </div>
        </div>
      </Show>
    </>
  )
}

export default ClerkProfileBanner

