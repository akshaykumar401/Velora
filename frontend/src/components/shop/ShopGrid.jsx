import { ProductCard } from '../product'

const ShopGrid = ({ products = [], onResetFilters }) => {
  if (products.length === 0) {
    return (
      <section className="py-20 sm:py-28 bg-[#FCF9F2]">
        <div className="max-w-[520px] mx-auto px-5 text-center">
          <p className="text-[10px] tracking-[0.24em] uppercase text-[#8A8379] mb-2">
            NO MATCHES FOUND
          </p>
          <h2 className="font-serif text-[26px] text-[#1A1816] mb-3">
            No pieces match your current selection
          </h2>
          <p className="text-[13px] leading-[1.7] text-[#6D6860] mb-7">
            Try clearing your search term or browsing all departments in the Velora
            archive.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="px-7 py-3 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors cursor-pointer"
          >
            RESET FILTERS
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-16 bg-[#FCF9F2]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10 lg:gap-x-6 lg:gap-y-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ShopGrid

