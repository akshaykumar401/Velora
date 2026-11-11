import ProductCard from './ProductCard.jsx'

const RelatedProducts = ({ products = [] }) => {
  if (products.length === 0) return null

  return (
    <section className="py-16 sm:py-20 bg-[#FCF9F2] border-t border-[#EAE5DC]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-8 sm:mb-10">
          <p className="text-[10px] tracking-[0.24em] uppercase text-[#8A8379] mb-1.5">
            COMPLEMENTARY PIECES
          </p>
          <h2 className="font-serif text-[28px] sm:text-[32px] font-normal text-[#1A1816] leading-tight">
            You May Also Like
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default RelatedProducts

