import { useState } from 'react'
import { RiCheckLine } from '@remixicon/react'

const OrderSummary = ({ subtotal, itemCount, onCheckout }) => {
  const [checkedOut, setCheckedOut] = useState(false)

  const handleProceed = () => {
    setCheckedOut(true)
    onCheckout?.()
  }

  return (
    <aside className="bg-[#F6F3EC] p-6 sm:p-8 h-fit">
      <h2 className="font-serif text-[22px] font-normal text-[#1A1816] mb-6">
        Order Summary
      </h2>

      <div className="space-y-3 text-[13px] pb-5 border-b border-[#E5DFD3]">
        <div className="flex items-center justify-between text-[#5E5951]">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'piece' : 'pieces'})</span>
          <span className="text-[#1A1816] font-medium">${subtotal}</span>
        </div>
        <div className="flex items-center justify-between text-[#5E5951]">
          <span>Courier Shipping</span>
          <span className="text-[#1A1816]">Complimentary</span>
        </div>
      </div>

      <div className="flex items-center justify-between py-5 text-[15px] font-medium text-[#1A1816]">
        <span>Estimated Total</span>
        <span>${subtotal}</span>
      </div>

      <button
        type="button"
        onClick={handleProceed}
        disabled={itemCount === 0}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.22em] uppercase hover:bg-[#2B2825] transition-colors cursor-pointer disabled:opacity-40"
      >
        {checkedOut ? (
          <>
            <RiCheckLine size={15} aria-hidden="true" />
            <span>ORDER REQUEST RECEIVED</span>
          </>
        ) : (
          <span>PROCEED TO CHECKOUT</span>
        )}
      </button>

      {checkedOut && (
        <p className="text-[12px] leading-[1.6] text-[#5E5951] mt-3.5">
          Thank you for shopping with Velora. Checkout integration will finalize
          payment once backend endpoints are connected.
        </p>
      )}
    </aside>
  )
}

export default OrderSummary

