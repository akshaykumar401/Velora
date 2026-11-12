import { Link } from 'react-router-dom'
import { RiArrowRightLine } from '@remixicon/react'

const CuratedCategories = ({ categories = [] }) => {
  return (
    <section id="categories" className="py-16 sm:py-20 lg:py-24 bg-[#FCF9F2]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="text-[10px] tracking-[0.24em] uppercase text-[#8A8379] mb-1.5">
              CURATED SELECTION
            </p>
            <h2 className="font-serif text-[28px] sm:text-[32px] font-normal text-[#1A1816] leading-tight">
              Explore Categories
            </h2>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-[10.5px] font-medium tracking-[0.18em] uppercase text-[#4B463F] hover:text-[#1A1816] transition-colors self-start sm:self-auto"
          >
            <span>VIEW ALL CATEGORIES</span>
            <RiArrowRightLine size={14} aria-hidden="true" />
          </Link>
        </div>

        {/* 3-Column Category Cards */}
        {categories.length === 0 ? (
          <div className="border border-[#EAE5DC] bg-[#F6F3EC] p-10 text-center">
            <p className="font-serif text-[22px] text-[#1A1816] mb-2">
              No categories published yet
            </p>
            <p className="text-[13px] text-[#6D6860]">
              Categories created in the Velora Admin Console will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.to}
                className="group relative overflow-hidden aspect-[4/5] bg-[#EAE5DC] block"
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className={`w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 ${
                      category.placeholderBg ||
                      'bg-gradient-to-br from-[#C8BDB0] via-[#9D9082] to-[#574F47]'
                    }`}
                  >
                    <div className="w-full h-full bg-[radial-gradient(circle_at_30%_25%,rgba(252,249,242,0.35)_0%,transparent_60%)]" />
                  </div>
                )}

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#12100E]/80 via-[#12100E]/20 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 text-[#FCF9F2]">
                  <p className="text-[9.5px] tracking-[0.22em] uppercase text-[#E5DFD5]/85 mb-1">
                    {category.indexLabel}
                  </p>
                  <h3 className="font-serif text-[24px] sm:text-[26px] font-normal leading-tight mb-2.5">
                    {category.title}
                  </h3>
                  <span className="inline-flex items-center gap-2 text-[10px] font-medium tracking-[0.22em] uppercase text-[#FCF9F2] group-hover:gap-3 transition-all">
                    <span>DISCOVER</span>
                    <RiArrowRightLine size={14} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default CuratedCategories
