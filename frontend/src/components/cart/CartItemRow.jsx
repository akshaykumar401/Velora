import { Link } from 'react-router-dom'
import { RiAddLine, RiCloseLine, RiSubtractLine } from '@remixicon/react'

const CartItemRow = ({ item, onUpdateQuantity, onRemove }) => {
  const { key, product, size, color, quantity } = item
  const productHref = `/product/${product.id}`

  return (
    <div className="py-6 border-b border-[#EAE5DC] flex gap-5 sm:gap-6">
      {/* Thumbnail */}
      <Link
        to={productHref}
        className="w-24 sm:w-28 aspect-[4/4.8] bg-[#F2EDE4] overflow-hidden shrink-0 block"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center p-2 text-center ${
              product.placeholderTone ||
              'bg-gradient-to-b from-[#EDE7DD] to-[#E2DACD]'
            }`}
          >
            <span className="font-serif text-[12px] text-[#35312C] leading-tight">
              {product.name}
            </span>
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[9.5px] tracking-[0.18em] uppercase text-[#8E877D] mb-1">
              {product.category}
            </p>
            <Link
              to={productHref}
              className="font-serif text-[18px] text-[#1A1816] hover:underline underline-offset-4 decoration-[#C8C1B5]"
            >
              {product.name}
            </Link>
            <p className="text-[12px] text-[#6D6860] mt-1">
              {color} · Size {size}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onRemove(key)}
            aria-label={`Remove ${product.name} from bag`}
            className="p-1 text-[#78736B] hover:text-[#1A1816] transition-colors cursor-pointer"
          >
            <RiCloseLine size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 pt-4">
          <div className="inline-flex items-center border border-[#D8D1C5] px-2.5 py-1 gap-4">
            <button
              type="button"
              onClick={() => onUpdateQuantity(key, quantity - 1)}
              aria-label={`Decrease quantity for ${product.name}`}
              className="text-[#5E5951] hover:text-[#1A1816] cursor-pointer"
            >
              <RiSubtractLine size={14} aria-hidden="true" />
            </button>
            <span className="text-[12.5px] font-medium text-[#1A1816]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(key, quantity + 1)}
              aria-label={`Increase quantity for ${product.name}`}
              className="text-[#5E5951] hover:text-[#1A1816] cursor-pointer"
            >
              <RiAddLine size={14} aria-hidden="true" />
            </button>
          </div>

          <p className="text-[13.5px] font-medium text-[#1A1816]">
            ${product.price * quantity}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CartItemRow

