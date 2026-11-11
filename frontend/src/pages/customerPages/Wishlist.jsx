import { Link } from 'react-router-dom'
import { RiHeartLine } from '@remixicon/react'
import { ProductCard } from '../../components/product'
import { useStore } from '../../features/store/storeContext.js'

const Wishlist = () => {
  const { wishlistProducts } = useStore()

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#FCF9F2]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#EAE5DC]">
          <div>
            <p className="text-[10px] tracking-[0.24em] uppercase text-[#8A8379] mb-1.5">
              SAVED ARCHIVE
            </p>
            <h1 className="font-serif text-[32px] sm:text-[40px] font-normal text-[#1A1816] leading-tight">
              Wishlist
            </h1>
          </div>

          <p className="text-[11px] tracking-[0.18em] uppercase text-[#78736B]">
            {wishlistProducts.length}{' '}
            {wishlistProducts.length === 1 ? 'Saved Piece' : 'Saved Pieces'}
          </p>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="py-20 sm:py-24 max-w-[460px] mx-auto text-center">
            <div className="w-12 h-12 rounded-full bg-[#F3EFE6] text-[#5E5951] flex items-center justify-center mx-auto mb-5">
              <RiHeartLine size={20} aria-hidden="true" />
            </div>
            <h2 className="font-serif text-[26px] text-[#1A1816] mb-3">
              No pieces saved yet
            </h2>
            <p className="text-[13px] leading-[1.7] text-[#6D6860] mb-8">
              Select the heart icon on any garment or accessory to curate your
              personal Velora wardrobe list.
            </p>
            <Link
              to="/shop"
              className="inline-block px-7 py-3.5 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors"
            >
              BROWSE COLLECTION
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10 lg:gap-x-6 lg:gap-y-12 pt-10">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Wishlist
