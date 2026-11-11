import { Link } from 'react-router-dom'
import { RiArrowRightLine } from '@remixicon/react'
import { ProductCard } from '../product'

const CollectionShowcaseCard = ({ collection, reversed = false }) => {
  return (
    <article className="py-14 sm:py-20 border-b border-[#EAE5DC] last:border-b-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center mb-10 sm:mb-12">
        {/* Visual Frame */}
        <div
          className={`lg:col-span-6 min-w-0 ${
            reversed ? 'lg:order-2' : 'lg:order-1'
          }`}
        >
          <div className="aspect-[4/3.2] bg-[#EAE5DC] overflow-hidden">
            {collection.coverImage ? (
              <img
                src={collection.coverImage}
                alt={collection.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full flex items-end p-8 ${
                  collection.placeholderBg ||
                  'bg-gradient-to-br from-[#D5CBC0] via-[#A99C8E] to-[#4E463F]'
                }`}
              >
                <span className="text-[10px] tracking-[0.26em] uppercase text-[#FCF9F2]/80">
                  {collection.season}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Copy */}
        <div
          className={`lg:col-span-6 max-w-[500px] min-w-0 ${
            reversed ? 'lg:order-1' : 'lg:order-2 lg:pl-4'
          }`}
        >
          <p className="text-[10px] tracking-[0.24em] uppercase text-[#8A8379] mb-2">
            {collection.season}
          </p>
          <h2 className="font-serif text-[30px] sm:text-[36px] font-normal text-[#1A1816] leading-tight mb-4">
            {collection.title}
          </h2>
          <p className="text-[13.5px] leading-[1.75] text-[#666058] mb-7">
            {collection.description}
          </p>
          <Link
            to={collection.ctaTo}
            className="inline-flex items-center gap-2.5 text-[10.5px] font-medium tracking-[0.18em] uppercase text-[#1A1816] border-b border-[#1A1816]/40 pb-1.5 hover:border-[#1A1816] transition-colors"
          >
            <span>EXPLORE CAPSULE</span>
            <RiArrowRightLine size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Capsule Pieces */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
        {collection.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </article>
  )
}

export default CollectionShowcaseCard

