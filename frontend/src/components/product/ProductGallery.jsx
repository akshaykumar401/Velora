const ProductGallery = ({ product }) => {
  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/4.8] bg-[#F2EDE4] overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full flex flex-col items-center justify-center p-10 text-center ${
              product.placeholderTone ||
              'bg-gradient-to-b from-[#EDE7DD] to-[#E2DACD]'
            }`}
          >
            <span className="text-[10px] tracking-[0.26em] uppercase text-[#7E776D] mb-2.5">
              {product.category}
            </span>
            <span className="font-serif text-[26px] text-[#35312C] max-w-[260px] leading-snug">
              {product.name}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductGallery

