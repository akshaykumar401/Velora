import { NavLink } from 'react-router-dom'

const CARE_TABS = [
  { label: 'Contact Us', to: '/contact' },
  { label: 'Shipping & Returns', to: '/shipping' },
  { label: 'FAQ', to: '/faq' },
]

const CarePageHeader = ({ title, subtitle }) => {
  return (
    <section className="pt-12 pb-8 sm:pt-16 sm:pb-10 bg-[#FCF9F2] border-b border-[#EAE5DC]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="max-w-[660px] mb-7">
          <p className="text-[10px] tracking-[0.26em] uppercase text-[#8A8379] mb-2">
            CUSTOMER CARE
          </p>
          <h1 className="font-serif text-[34px] sm:text-[44px] font-normal text-[#1A1816] leading-[1.1] mb-3">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[13px] sm:text-[14px] leading-[1.7] text-[#666058]">
              {subtitle}
            </p>
          )}
        </div>

        <nav
          aria-label="Customer care sections"
          className="w-full max-w-full min-w-0 flex items-center gap-2 overflow-x-auto pb-1"
        >
          {CARE_TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `px-4 py-2 text-[11px] tracking-[0.14em] uppercase whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#151413] text-[#FCF9F2] font-medium'
                    : 'bg-[#F3EFE6] text-[#68635B] hover:text-[#1A1816]'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </section>
  )
}

export default CarePageHeader

