import { useState } from 'react'
import { Link } from 'react-router-dom'

const NAVIGATION_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Shop', to: '/shop' },
  { label: 'Categories', to: '/categories' },
]

const CUSTOMER_CARE_LINKS = [
  { label: 'Contact Us', to: '/contact' },
  { label: 'Shipping & Returns', to: '/shipping' },
  { label: 'FAQ', to: '/faq' },
]

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="bg-[#F6F3EC] text-[#1A1816]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 pt-14 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-3">
            <h2 className="font-serif text-[14px] font-medium tracking-[0.2em] uppercase text-[#1A1816] mb-4">
              VELORA
            </h2>
            <p className="text-[12.5px] leading-[1.65] text-[#78736B] max-w-[235px]">
              Timeless luxury and artisanal craftsmanship for the discerning wardrobe.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-3">
            <h3 className="font-serif text-[13px] font-medium tracking-[0.16em] uppercase text-[#1A1816] mb-4">
              NAVIGATION
            </h3>
            <ul className="space-y-2.5">
              {NAVIGATION_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[12.5px] text-[#78736B] hover:text-[#1A1816] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="lg:col-span-3">
            <h3 className="font-serif text-[13px] font-medium tracking-[0.16em] uppercase text-[#1A1816] mb-4">
              CUSTOMER CARE
            </h3>
            <ul className="space-y-2.5">
              {CUSTOMER_CARE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[12.5px] text-[#78736B] hover:text-[#1A1816] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3">
            <h3 className="font-serif text-[13px] font-medium tracking-[0.16em] uppercase text-[#1A1816] mb-4">
              NEWSLETTER
            </h3>
            <p className="text-[12.5px] text-[#78736B] mb-4">
              Subscribe to receive updates and offers.
            </p>
            <form onSubmit={handleSubscribe}>
              <div className="flex items-center justify-between border-b border-[#CFC9BE] focus-within:border-[#1A1816] pb-2 transition-colors">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (subscribed) setSubscribed(false)
                  }}
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className="w-full bg-transparent text-[12.5px] text-[#1A1816] placeholder:text-[#969087] focus:outline-none pr-3"
                />
                <button
                  type="submit"
                  className="text-[11px] font-medium tracking-[0.18em] uppercase text-[#1A1816] hover:opacity-65 transition-opacity shrink-0 cursor-pointer"
                >
                  JOIN
                </button>
              </div>
              {subscribed && (
                <p className="text-[11.5px] text-[#5B564F] mt-2">
                  Thank you for joining the Velora Circle.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-[#E6E1D7]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 py-6 text-center">
          <p className="text-[11.5px] text-[#857F76] tracking-[0.02em]">
            &copy; {new Date().getFullYear()} Velora Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
