import { Link } from 'react-router-dom'
import { Show, UserButton } from '@clerk/react'
import {
  RiFileList3Line,
  RiHeartLine,
  RiMapPinLine,
  RiUserLine,
} from '@remixicon/react'
import { isClerkConfigured } from '../../features/auth/clerkConfig.js'

const SignInAvatarLink = () => (
  <Link
    to="/sign-in"
    aria-label="Sign in to account"
    className="w-8 h-8 rounded-full bg-[#151413] text-[#FCF9F2] flex items-center justify-center hover:bg-[#2F2C29] transition-colors"
  >
    <RiUserLine size={16} aria-hidden="true" />
  </Link>
)

const AuthHeaderControl = () => {
  if (!isClerkConfigured) {
    return <SignInAvatarLink />
  }

  return (
    <>
      <Show when="signed-out">
        <SignInAvatarLink />
      </Show>

      <Show when="signed-in">
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'w-8 h-8 border border-[#D8D1C5]',
            },
          }}
        >
          <UserButton.MenuItems>
            <UserButton.Link
              href="/profile"
              label="My Profile"
              labelIcon={<RiUserLine size={14} />}
            />
            <UserButton.Link
              href="/orders"
              label="My Orders"
              labelIcon={<RiFileList3Line size={14} />}
            />
            <UserButton.Link
              href="/addresses"
              label="My Addresses"
              labelIcon={<RiMapPinLine size={14} />}
            />
            <UserButton.Link
              href="/wishlist"
              label="Saved Wishlist"
              labelIcon={<RiHeartLine size={14} />}
            />
          </UserButton.MenuItems>
        </UserButton>
      </Show>
    </>
  )
}

export default AuthHeaderControl

