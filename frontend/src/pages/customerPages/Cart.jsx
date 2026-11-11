import { Link } from 'react-router-dom'
import { RiArrowLeftLine, RiShoppingBagLine } from '@remixicon/react'
import { CartItemRow, OrderSummary } from '../../components/cart'
import { useStore } from '../../features/store/storeContext.js'

const Cart = () => {
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  } = useStore()

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#FCF9F2]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#EAE5DC]">
          <div>
            <p className="text-[10px] tracking-[0.24em] uppercase text-[#8A8379] mb-1.5">
              YOUR SELECTION
            </p>
            <h1 className="font-serif text-[32px] sm:text-[40px] font-normal text-[#1A1816] leading-tight">
              Shopping Bag
            </h1>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-[#4B463F] hover:text-[#1A1816] transition-colors"
          >
            <RiArrowLeftLine size={14} aria-hidden="true" />
            <span>CONTINUE SHOPPING</span>
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="py-20 sm:py-24 max-w-[460px] mx-auto text-center">
            <div className="w-12 h-12 rounded-full bg-[#F3EFE6] text-[#5E5951] flex items-center justify-center mx-auto mb-5">
              <RiShoppingBagLine size={20} aria-hidden="true" />
            </div>
            <h2 className="font-serif text-[26px] text-[#1A1816] mb-3">
              Your bag is currently empty
            </h2>
            <p className="text-[13px] leading-[1.7] text-[#6D6860] mb-8">
              Discover our autumn-winter outerwear, cashmere knitwear, and
              Italian leather essentials.
            </p>
            <Link
              to="/shop"
              className="inline-block px-7 py-3.5 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors"
            >
              EXPLORE COLLECTION
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pt-6">
            <div className="lg:col-span-8">
              {cartItems.map((item) => (
                <CartItemRow
                  key={item.key}
                  item={item}
                  onUpdateQuantity={updateCartQuantity}
                  onRemove={removeFromCart}
                />
              ))}

              <div className="pt-5">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[11px] tracking-[0.16em] uppercase text-[#78736B] hover:text-[#1A1816] transition-colors cursor-pointer"
                >
                  Clear Bag
                </button>
              </div>
            </div>

            <div className="lg:col-span-4">
              <OrderSummary subtotal={cartSubtotal} itemCount={cartCount} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Cart
