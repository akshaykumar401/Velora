import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  RiCloseLine,
  RiHeartLine,
  RiMenuLine,
  RiSearchLine,
  RiShoppingBagLine,
  RiUserLine,
} from '@remixicon/react'
import BrandLogo from './BrandLogo.jsx'
import { useStore } from '../../features/store/storeContext.js'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Categories', to: '/categories' },
  { label: 'Collections', to: '/collections' },
  { label: 'About', to: '/about' },
]

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { cartCount, wishlistCount } = useStore()

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    navigate(trimmed ? `/shop?search=${encodeURIComponent(trimmed)}` : '/shop')
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-[#FCF9F2]/95 backdrop-blur-md border-b border-[#EAE5DC]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 h-[72px] flex items-center justify-between gap-4 lg:gap-8">
        {/* Brand */}
        <Link to="/" aria-label="Velora Home">
          <BrandLogo />
        </Link>

        {/* Desktop Center Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden lg:flex items-center gap-7 xl:gap-9"
        >
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `text-[13px] tracking-[0.02em] transition-colors duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-[#1A1816] font-semibold'
                    : 'text-[#6D6860] hover:text-[#1A1816] font-normal'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions: Search + Wishlist + Cart + Profile */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex items-center relative w-40 md:w-48 xl:w-56"
            role="search"
          >
            <RiSearchLine
              size={14}
              className="text-[#8A847B] absolute left-3 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              aria-label="Search products"
              className="w-full pl-8 pr-3 py-1.5 text-[12.5px] bg-[#F3EFE6] text-[#1A1816] placeholder:text-[#8E887F] rounded-md border border-transparent focus:border-[#D6CFC3] focus:bg-[#FAF7F0] focus:outline-none transition-colors"
            />
          </form>

          <Link
            to="/wishlist"
            aria-label={`Wishlist (${wishlistCount})`}
            className="relative p-1.5 text-[#2C2925] hover:text-[#1A1816] transition-colors"
          >
            <RiHeartLine size={18} aria-hidden="true" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#151413] text-[#FCF9F2] text-[9px] font-medium flex items-center justify-center leading-none">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            aria-label={`Shopping Bag (${cartCount})`}
            className="relative p-1.5 text-[#2C2925] hover:text-[#1A1816] transition-colors"
          >
            <RiShoppingBagLine size={18} aria-hidden="true" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#151413] text-[#FCF9F2] text-[9px] font-medium flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to="/profile"
            aria-label="Account"
            className="w-8 h-8 rounded-full bg-[#151413] text-[#FCF9F2] flex items-center justify-center hover:bg-[#2F2C29] transition-colors"
          >
            <RiUserLine size={16} aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden p-1.5 text-[#1A1816] hover:opacity-70 transition-opacity cursor-pointer"
          >
            {mobileMenuOpen ? (
              <RiCloseLine size={20} aria-hidden="true" />
            ) : (
              <RiMenuLine size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EAE5DC] bg-[#FCF9F2] px-5 sm:px-8 py-5 space-y-4">
          <form onSubmit={handleSearchSubmit} className="sm:hidden relative flex items-center" role="search">
            <RiSearchLine
              size={14}
              className="text-[#8A847B] absolute left-3 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              aria-label="Search products"
              className="w-full pl-8 pr-3 py-2 text-[13px] bg-[#F3EFE6] text-[#1A1816] placeholder:text-[#8E887F] rounded-md border border-transparent focus:border-[#D6CFC3] focus:bg-[#FAF7F0] focus:outline-none"
            />
          </form>

          <nav aria-label="Mobile navigation" className="flex flex-col gap-3">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-[14px] py-1 transition-colors ${
                    isActive
                      ? 'text-[#1A1816] font-semibold'
                      : 'text-[#6D6860] hover:text-[#1A1816]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar
