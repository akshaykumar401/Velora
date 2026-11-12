import { useState } from 'react'
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react'
import { ProductCard } from '../product'

const VISIBLE_COUNT = 4

const TrendingProducts = ({ products = [] }) => {
  const [startIndex, setStartIndex] = useState(0)

  const canNavigate = products.length > VISIBLE_COUNT

  const handlePrev = () => {
    if (!canNavigate) return
    setStartIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  const handleNext = () => {
    if (!canNavigate) return
    setStartIndex((prev) => (prev + 1) % products.length)
  }

  const visibleProducts =
    products.length <= VISIBLE_COUNT
      ? products
      : Array.from(
          { length: VISIBLE_COUNT },
          (_, offset) => products[(startIndex + offset) % products.length],
        )

  return (
    <section className="py-14 sm:py-20 bg-[#FCF9F2]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="text-[10px] tracking-[0.24em] uppercase text-[#8A8379] mb-1.5">
              HANDCRAFTED PERFECTION
            </p>
            <h2 className="font-serif text-[28px] sm:text-[32px] font-normal text-[#1A1816] leading-tight">
              Trending Products
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={!canNavigate}
              aria-label="Previous trending products"
              className="w-9 h-9 rounded-full border border-[#DFD9CE] flex items-center justify-center text-[#5B564E] hover:border-[#1A1816] hover:text-[#1A1816] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default"
            >
              <RiArrowLeftSLine size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!canNavigate}
              aria-label="Next trending products"
              className="w-9 h-9 rounded-full border border-[#DFD9CE] flex items-center justify-center text-[#5B564E] hover:border-[#1A1816] hover:text-[#1A1816] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default"
            >
              <RiArrowRightSLine size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* 4-Column Product Grid */}
        {visibleProducts.length === 0 ? (
          <div className="border border-[#EAE5DC] bg-[#F6F3EC] p-10 text-center">
            <p className="font-serif text-[22px] text-[#1A1816] mb-2">
              No products in the collection yet
            </p>
            <p className="text-[13px] text-[#6D6860]">
              New arrivals published in the Admin Console will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default TrendingProducts
