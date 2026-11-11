import { NavLink } from 'react-router-dom'
import {
  RiEditLine,
  RiFileList3Line,
  RiHeartLine,
  RiMapPinLine,
  RiUserLine,
} from '@remixicon/react'

const ACCOUNT_LINKS = [
  { label: 'Overview', to: '/profile', end: true, Icon: RiUserLine },
  { label: 'Edit Profile', to: '/profile/edit', end: true, Icon: RiEditLine },
  { label: 'My Addresses', to: '/addresses', end: true, Icon: RiMapPinLine },
  { label: 'My Orders', to: '/orders', end: false, Icon: RiFileList3Line },
  { label: 'Wishlist', to: '/wishlist', end: true, Icon: RiHeartLine },
]

const ProfileLayout = ({ eyebrow = 'CLIENT ACCOUNT', title, subtitle, children }) => {
  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-[#FCF9F2]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Account Header */}
        <div className="pb-8 border-b border-[#EAE5DC]">
          <p className="text-[10px] tracking-[0.26em] uppercase text-[#8A8379] mb-1.5">
            {eyebrow}
          </p>
          <h1 className="font-serif text-[32px] sm:text-[40px] font-normal text-[#1A1816] leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[13px] text-[#666058] mt-2 max-w-[540px]">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8">
          {/* Sidebar / Mobile Tabs */}
          <aside className="lg:col-span-3 min-w-0">
            <nav
              aria-label="Account navigation"
              className="w-full max-w-full min-w-0 flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0"
            >
              {ACCOUNT_LINKS.map((item) => {
                const IconComponent = item.Icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `inline-flex items-center gap-2.5 px-3.5 py-2.5 text-[12.5px] whitespace-nowrap transition-colors ${
                        isActive
                          ? 'bg-[#151413] text-[#FCF9F2] font-medium'
                          : 'text-[#666058] hover:text-[#1A1816] hover:bg-[#F3EFE6]'
                      }`
                    }
                  >
                    <IconComponent size={15} aria-hidden="true" />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 min-w-0">{children}</div>
        </div>
      </div>
    </section>
  )
}

export default ProfileLayout

