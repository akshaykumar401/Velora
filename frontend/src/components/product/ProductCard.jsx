import { Link, useLocation, useNavigate } from 'react-router-dom'
import { RiHeartFill, RiHeartLine } from '@remixicon/react'
import { useAuthStatus } from '../../features/auth/authContext.js'
import { useStore } from '../../features/store/storeContext.js'

const ProductCard = ({ product }) => {
  const { isSignedIn } = useAuthStatus()
  const { isWishlisted, toggleWishlist } = useStore()
  const navigate = useNavigate()
  const location = useLocation()

  const wishlisted = isSignedIn && isWishlisted(product.id)
  const productHref = product.id ? `/product/${product.id}` : product.to || '/shop'

  const handleWishlistClick = () => {
    if (!isSignedIn) {
      navigate('/sign-in', {
        state: { from: `${location.pathname}${location.search}` },
      })
      return
    }
    toggleWishlist(product.id)
  }

  return (
    <article className="group">
      <div className="relative aspect-[4/4.6] bg-[#F2EDE4] overflow-hidden mb-3.5">
        <Link to={productHref} className="block w-full h-full">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div
              className={`w-full h-full flex flex-col items-center justify-center p-6 text-center transition-transform duration-700 ease-out group-hover:scale-[1.03] ${
                product.placeholderTone ||
                'bg-gradient-to-b from-[#EDE7DD] to-[#E2DACD]'
              }`}
            >
              <span className="text-[9px] tracking-[0.26em] uppercase text-[#7E776D] mb-2">
                {product.category}
              </span>
              <span className="font-serif text-[18px] text-[#35312C] max-w-[160px] leading-snug">
                {product.name}
              </span>
            </div>
          )}
        </Link>

        <button
          type="button"
          onClick={handleWishlistClick}
          title={isSignedIn ? 'Toggle wishlist' : 'Sign in to save to wishlist'}
          aria-label={
            !isSignedIn
              ? `Sign in to save ${product.name} to wishlist`
              : wishlisted
                ? `Remove ${product.name} from wishlist`
                : `Save ${product.name} to wishlist`
          }
          aria-pressed={wishlisted}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-xs cursor-pointer ${
            wishlisted
              ? 'bg-[#1A1816] text-[#FCF9F2]'
              : 'bg-[#FCF9F2]/90 backdrop-blur-xs text-[#2C2925] hover:bg-[#FCF9F2]'
          }`}
        >
          {wishlisted ? (
            <RiHeartFill size={16} aria-hidden="true" />
          ) : (
            <RiHeartLine size={16} aria-hidden="true" />
          )}
        </button>
      </div>

      <Link to={productHref} className="block">
        <p className="text-[9.5px] tracking-[0.18em] uppercase text-[#8E877D] mb-1">
          {product.category}
        </p>
        <h3 className="font-serif text-[16px] text-[#1A1816] leading-snug mb-1 group-hover:underline underline-offset-4 decoration-[#C8C1B5]">
          {product.name}
        </h3>
        <p className="text-[12.5px] font-medium text-[#1A1816]">
          ${product.price}
        </p>
      </Link>
    </article>
  )
}

export default ProductCard
