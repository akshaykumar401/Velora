const CheckoutSummary = ({
  items = [],
  subtotal = 0,
  shippingFee = 0,
  formId = 'velora-checkout-form',
}) => {
  const total = subtotal + shippingFee

  return (
    <aside className="bg-[#F6F3EC] p-6 sm:p-8 h-fit border border-[#EAE5DC]">
      <h2 className="font-serif text-[22px] font-normal text-[#1A1816] mb-6">
        Order Review
      </h2>

      <div className="space-y-4 pb-6 border-b border-[#E5DFD3]">
        {items.map((item) => (
          <div key={item.key} className="flex items-center gap-3.5">
            <div className="w-14 aspect-[4/4.8] bg-[#EAE5DC] overflow-hidden shrink-0">
              {item.product.image ? (
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full ${
                    item.product.placeholderTone ||
                    'bg-gradient-to-b from-[#EDE7DD] to-[#E2DACD]'
                  }`}
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-serif text-[15px] text-[#1A1816] truncate">
                {item.product.name}
              </p>
              <p className="text-[11.5px] text-[#6D6860]">
                {item.color} · {item.size} × {item.quantity}
              </p>
            </div>

            <p className="text-[13px] font-medium text-[#1A1816] shrink-0">
              ${item.product.price * item.quantity}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-3 text-[13px] py-5 border-b border-[#E5DFD3]">
        <div className="flex items-center justify-between text-[#5E5951]">
          <span>Subtotal</span>
          <span className="text-[#1A1816] font-medium">${subtotal}</span>
        </div>
        <div className="flex items-center justify-between text-[#5E5951]">
          <span>Courier Shipping</span>
          <span className="text-[#1A1816]">
            {shippingFee === 0 ? 'Complimentary' : `$${shippingFee}`}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between py-5 text-[16px] font-medium text-[#1A1816]">
        <span>Total</span>
        <span>${total}</span>
      </div>

      <button
        type="submit"
        form={formId}
        className="w-full px-6 py-3.5 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.22em] uppercase hover:bg-[#2B2825] transition-colors cursor-pointer"
      >
        PLACE ORDER
      </button>
    </aside>
  )
}

export default CheckoutSummary

