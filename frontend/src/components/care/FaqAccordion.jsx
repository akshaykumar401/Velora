import { useState } from 'react'
import { RiAddLine, RiSubtractLine } from '@remixicon/react'

const FaqAccordion = ({ categories = [], items = [] }) => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [openId, setOpenId] = useState(() => items[0]?.id || '')

  const visibleItems =
    activeCategory === 'All'
      ? items
      : items.filter((item) => item.category === activeCategory)

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#FCF9F2]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="w-full max-w-full min-w-0 flex items-center gap-2 overflow-x-auto pb-2 mb-8">
          {categories.map((cat) => {
            const active = activeCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 text-[11px] tracking-[0.14em] uppercase whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#151413] text-[#FCF9F2] font-medium'
                    : 'bg-[#F3EFE6] text-[#68635B] hover:text-[#1A1816]'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        <div className="max-w-[820px] border-t border-[#E6E1D7]">
          {visibleItems.map((item) => {
            const isOpen = openId === item.id
            return (
              <div key={item.id} className="border-b border-[#E6E1D7]">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? '' : item.id)}
                  aria-expanded={isOpen}
                  className="w-full py-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                >
                  <div>
                    <p className="text-[9.5px] tracking-[0.18em] uppercase text-[#8A8379] mb-1">
                      {item.category}
                    </p>
                    <h2 className="font-serif text-[20px] sm:text-[22px] font-normal text-[#1A1816]">
                      {item.question}
                    </h2>
                  </div>
                  {isOpen ? (
                    <RiSubtractLine
                      size={18}
                      className="text-[#1A1816] shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <RiAddLine
                      size={18}
                      className="text-[#6D6860] shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </button>

                {isOpen && (
                  <p className="pb-5 text-[13.5px] leading-[1.75] text-[#5E5951]">
                    {item.answer}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FaqAccordion

