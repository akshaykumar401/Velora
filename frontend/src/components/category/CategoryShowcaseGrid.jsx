import { Link } from 'react-router-dom'
import { RiArrowRightLine } from '@remixicon/react'

const CategoryShowcaseGrid = ({ categories = [] }) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#FCF9F2]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        {categories.length === 0 ? (
          <div className="border border-[#EAE5DC] bg-[#F6F3EC] p-12 text-center">
            <p className="font-serif text-[24px] text-[#1A1816] mb-2">
              No departments configured yet
            </p>
            <p className="text-[13px] text-[#6D6860]">
              Add categories via Admin Console to showcase departments here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.to}
                className="group relative overflow-hidden aspect-[4/4.8] bg-[#EAE5DC] block"
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
                  className="absolute inset-0 bg-gradient-to-t from-[#12100E]/85 via-[#12100E]/25 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 text-[#FCF9F2]">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <p className="text-[9.5px] tracking-[0.22em] uppercase text-[#E5DFD5]/85">
                      {category.indexLabel}
                    </p>
                    <span className="text-[9.5px] tracking-[0.18em] uppercase text-[#E5DFD5]/80">
                      {category.itemCount}{' '}
                      {category.itemCount === 1 ? 'Piece' : 'Pieces'}
                    </span>
                  </div>

                  <h2 className="font-serif text-[25px] sm:text-[27px] font-normal leading-tight mb-2">
                    {category.title}
                  </h2>

                  <p className="text-[12px] leading-[1.6] text-[#EDE7DE]/85 mb-4 line-clamp-2">
                    {category.subtitle}
                  </p>

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

export default CategoryShowcaseGrid

