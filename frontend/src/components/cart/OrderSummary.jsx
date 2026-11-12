import { Link } from 'react-router-dom'
import { formatINR } from '../../utils/currency.js'

const OrderSummary = ({ subtotal, itemCount }) => {
  return (
    <aside className="bg-[#F6F3EC] p-6 sm:p-8 h-fit">
      <h2 className="font-serif text-[22px] font-normal text-[#1A1816] mb-6">
        Order Summary
      </h2>

      <div className="space-y-3 text-[13px] pb-5 border-b border-[#E5DFD3]">
        <div className="flex items-center justify-between text-[#5E5951]">
          <span>
            Subtotal ({itemCount} {itemCount === 1 ? 'piece' : 'pieces'})
          </span>
          <span className="text-[#1A1816] font-medium">
            {formatINR(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between text-[#5E5951]">
          <span>Courier Shipping</span>
          <span className="text-[#1A1816]">Complimentary</span>
        </div>
      </div>

      <div className="flex items-center justify-between py-5 text-[15px] font-medium text-[#1A1816]">
        <span>Estimated Total</span>
        <span>{formatINR(subtotal)}</span>
      </div>

      <Link
        to="/checkout"
        className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.22em] uppercase hover:bg-[#2B2825] transition-colors"
      >
        PROCEED TO CHECKOUT
      </Link>
    </aside>
  )
}

export default OrderSummary
