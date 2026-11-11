import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  RiAddLine,
  RiCheckLine,
  RiHeartFill,
  RiHeartLine,
  RiLockLine,
  RiSubtractLine,
} from '@remixicon/react'
import { useAuthStatus } from '../../features/auth/authContext.js'
import { useStore } from '../../features/store/storeContext.js'

const ACCORDION_ITEMS = [
  { key: 'fabric', title: 'Material & Provenance' },
  { key: 'care', title: 'Care & Longevity' },
  {
    key: 'shipping',
    title: 'Shipping & Complimentary Returns',
    body: 'Complimentary carbon-neutral courier delivery on all orders. Returns and exchanges accepted within 30 days in unworn condition.',
  },
]

const ProductInfo = ({ product }) => {
  const { isSignedIn } = useAuthStatus()
  const { addToCart, isWishlisted, toggleWishlist } = useStore()
  const navigate = useNavigate()
  const location = useLocation()

  const [selectedColor, setSelectedColor] = useState(
    () => product.colors?.[0]?.name || 'Default',
  )
  const [selectedSize, setSelectedSize] = useState(
    () => product.sizes?.[0] || 'One Size',
  )
  const [quantity, setQuantity] = useState(1)
  const [addedFeedback, setAddedFeedback] = useState(false)
  const [openSection, setOpenSection] = useState('fabric')

  const wishlisted = isSignedIn && isWishlisted(product.id)

  const redirectToSignIn = () => {
    navigate('/sign-in', {
      state: { from: `${location.pathname}${location.search}` },
    })
  }

  const handleAddToBag = () => {
    if (!isSignedIn) {
      redirectToSignIn()
      return
    }
    addToCart({
      productId: product.id,
      size: selectedSize,
      color: selectedColor,
      quantity,
    })
    setAddedFeedback(true)
    window.setTimeout(() => setAddedFeedback(false), 1800)
  }

  const handleWishlist = () => {
    if (!isSignedIn) {
      redirectToSignIn()
      return
    }
    toggleWishlist(product.id)
  }

  return (
    <div className="lg:pl-6">
      <p className="text-[10px] tracking-[0.24em] uppercase text-[#8A8379] mb-2">
        {product.category}
      </p>

      <h1 className="font-serif text-[32px] sm:text-[38px] font-normal text-[#1A1816] leading-[1.15] mb-3">
        {product.name}
      </h1>

      <p className="text-[18px] font-medium text-[#1A1816] mb-6">
        ${product.price}
      </p>

      <p className="text-[13.5px] leading-[1.75] text-[#5E5951] mb-8">
        {product.description}
      </p>

      {/* Color Swatches */}
      {product.colors?.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-[11px] tracking-[0.16em] uppercase mb-2.5">
            <span className="text-[#78736B]">Color</span>
            <span className="text-[#1A1816] font-medium">{selectedColor}</span>
          </div>
          <div className="flex items-center gap-2.5">
            {product.colors.map((color) => {
              const active = selectedColor === color.name
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  aria-label={`Select color ${color.name}`}
                  aria-pressed={active}
                  className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                    active
                      ? 'border-[#1A1816] scale-110'
                      : 'border-[#CFC9BE] hover:border-[#6D6860]'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-black/10"
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Size Picker */}
      {product.sizes?.length > 0 && (
        <div className="mb-7">
          <div className="flex items-center justify-between text-[11px] tracking-[0.16em] uppercase mb-2.5">
            <span className="text-[#78736B]">Size</span>
            <span className="text-[#1A1816] font-medium">{selectedSize}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => {
              const active = selectedSize === size
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  aria-pressed={active}
                  className={`min-w-[46px] px-3.5 py-2 text-[11.5px] tracking-[0.12em] uppercase border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#151413] text-[#FCF9F2] border-[#151413]'
                      : 'bg-transparent text-[#1A1816] border-[#D8D1C5] hover:border-[#1A1816]'
                  }`}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Purchase / Auth-Gated Actions */}
      {isSignedIn ? (
        <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-9">
          <div className="flex items-center justify-between border border-[#D8D1C5] px-3 py-2.5 sm:w-28">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="text-[#5E5951] hover:text-[#1A1816] cursor-pointer"
            >
              <RiSubtractLine size={15} aria-hidden="true" />
            </button>
            <span className="text-[13px] font-medium text-[#1A1816]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
              className="text-[#5E5951] hover:text-[#1A1816] cursor-pointer"
            >
              <RiAddLine size={15} aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToBag}
            className="flex-1 inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#0F0E0D] text-[#FCF9F2] text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors cursor-pointer"
          >
            {addedFeedback ? (
              <>
                <RiCheckLine size={15} aria-hidden="true" />
                <span>ADDED TO BAG</span>
              </>
            ) : (
              <span>ADD TO BAG</span>
            )}
          </button>

          <button
            type="button"
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-pressed={wishlisted}
            className="inline-flex items-center justify-center gap-2 px-4 py-3.5 border border-[#D8D1C5] text-[#1A1816] hover:border-[#1A1816] transition-colors cursor-pointer"
          >
            {wishlisted ? (
              <RiHeartFill size={17} aria-hidden="true" />
            ) : (
              <RiHeartLine size={17} aria-hidden="true" />
            )}
          </button>
        </div>
      ) : (
        <div className="mb-9 bg-[#F6F3EC] border border-[#EAE5DC] p-5 space-y-3.5">
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <Link
              to="/sign-in"
              state={{ from: `${location.pathname}${location.search}` }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0F0E0D] text-[#FCF9F2] text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors"
            >
              <RiLockLine size={14} aria-hidden="true" />
              <span>SIGN IN TO PURCHASE</span>
            </Link>

            <button
              type="button"
              onClick={handleWishlist}
              aria-label="Sign in to save to wishlist"
              className="inline-flex items-center justify-center gap-2 px-4 py-3.5 border border-[#D8D1C5] bg-[#FCF9F2] text-[#1A1816] hover:border-[#1A1816] transition-colors cursor-pointer"
            >
              <RiHeartLine size={17} aria-hidden="true" />
            </button>
          </div>
          <p className="text-[12px] leading-[1.6] text-[#666058]">
            Sign in with your Velora account to unlock adding items to your bag,
            saving to your wishlist, and checkout.
          </p>
        </div>
      )}

      {/* Accordion Details */}
      <div className="border-t border-[#E6E1D7]">
        {ACCORDION_ITEMS.map((item) => {
          const isOpen = openSection === item.key
          const content = item.body || product[item.key]
          if (!content) return null
          return (
            <div key={item.key} className="border-b border-[#E6E1D7]">
              <button
                type="button"
                onClick={() => setOpenSection(isOpen ? '' : item.key)}
                aria-expanded={isOpen}
                className="w-full py-4 flex items-center justify-between text-left cursor-pointer"
              >
                <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-[#1A1816]">
                  {item.title}
                </span>
                {isOpen ? (
                  <RiSubtractLine size={15} className="text-[#6D6860]" aria-hidden="true" />
                ) : (
                  <RiAddLine size={15} className="text-[#6D6860]" aria-hidden="true" />
                )}
              </button>
              {isOpen && (
                <p className="pb-4 text-[12.5px] leading-[1.7] text-[#666058]">
                  {content}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProductInfo
