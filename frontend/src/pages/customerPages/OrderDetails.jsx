import { Link, useParams } from 'react-router-dom'
import { RiArrowLeftLine } from '@remixicon/react'
import { useAppSelector } from '../../App/hooks.js'
import { ProfileLayout } from '../../components/profile'
import { useStore } from '../../features/store/storeContext.js'
import { formatOrderPaymentLabel } from '../../utils/catalog.js'
import { formatINR } from '../../utils/currency.js'

const OrderDetails = () => {
  const { id } = useParams()
  const catalogProducts = useAppSelector((state) => state.catalog.products)
  const { orders, getOrderById } = useStore()
  const order = id ? getOrderById(id) : orders[0]

  if (!order) {
    return (
      <ProfileLayout title="Order Not Found">
        <div className="border border-[#EAE5DC] bg-[#F6F3EC] p-10 text-center">
          <p className="font-serif text-[24px] text-[#1A1816] mb-2">
            Unable to locate order {id}
          </p>
          <p className="text-[13px] text-[#6D6860] mb-6">
            Please return to your order history to select a valid receipt.
          </p>
          <Link
            to="/orders"
            className="inline-block px-7 py-3 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase"
          >
            VIEW ALL ORDERS
          </Link>
        </div>
      </ProfileLayout>
    )
  }

  return (
    <ProfileLayout
      eyebrow="ORDER RECEIPT"
      title={`Order ${order.id}`}
      subtitle={`Placed on ${order.createdAt} · Status: ${order.status}`}
    >
      <div className="space-y-8">
        <div>
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-[#4B463F] hover:text-[#1A1816] transition-colors"
          >
            <RiArrowLeftLine size={14} aria-hidden="true" />
            <span>BACK TO MY ORDERS</span>
          </Link>
        </div>

        {/* Itemized List */}
        <div className="border border-[#E5DFD3] bg-[#FCF9F2]">
          <div className="px-5 sm:px-6 py-4 border-b border-[#EAE5DC] flex items-center justify-between gap-3">
            <h2 className="font-serif text-[20px] font-normal text-[#1A1816]">
              Items Ordered
            </h2>
            <span className="px-3 py-1 bg-[#F3EFE6] text-[10px] tracking-[0.16em] uppercase text-[#1A1816]">
              {order.status}
            </span>
          </div>

          <div className="divide-y divide-[#EAE5DC]">
            {order.items.map((item, idx) => {
              const catalogMatch = catalogProducts.find(
                (p) => p.id === item.productId,
              )
              return (
                <div
                  key={`${item.productId}-${idx}`}
                  className="p-5 sm:p-6 flex items-center gap-4 sm:gap-5"
                >
                  <Link
                    to={`/product/${item.productId}`}
                    className="w-16 sm:w-20 aspect-[4/4.8] bg-[#F2EDE4] overflow-hidden shrink-0 block"
                  >
                    {catalogMatch?.image ? (
                      <img
                        src={catalogMatch.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full ${
                          catalogMatch?.placeholderTone ||
                          'bg-gradient-to-b from-[#EDE7DD] to-[#E2DACD]'
                        }`}
                      />
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <p className="text-[9.5px] tracking-[0.18em] uppercase text-[#8E877D] mb-0.5">
                      {item.category}
                    </p>
                    <Link
                      to={`/product/${item.productId}`}
                      className="font-serif text-[17px] text-[#1A1816] hover:underline underline-offset-4 decoration-[#C8C1B5]"
                    >
                      {item.name}
                    </Link>
                    <p className="text-[12px] text-[#6D6860] mt-1">
                      {item.color} · Size {item.size} · Qty {item.quantity}
                    </p>
                  </div>

                  <p className="text-[14px] font-medium text-[#1A1816] shrink-0">
                    {formatINR(item.price * item.quantity)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Shipping + Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-[#E5DFD3] p-6">
            <h2 className="font-serif text-[20px] font-normal text-[#1A1816] mb-4">
              Shipping &amp; Payment
            </h2>
            <div className="text-[13px] leading-[1.7] text-[#5E5951] space-y-3">
              <div>
                <p className="text-[10px] tracking-[0.16em] uppercase text-[#8A8379]">
                  Destination
                </p>
                <p className="text-[#1A1816] font-medium">
                  {order.shippingAddress?.recipient}
                </p>
                <p>{order.shippingAddress?.street}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.region}{' '}
                  {order.shippingAddress?.postalCode}
                </p>
                <p>{order.shippingAddress?.country}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.16em] uppercase text-[#8A8379]">
                  Courier Method
                </p>
                <p className="text-[#1A1816]">{order.deliveryMethod}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.16em] uppercase text-[#8A8379]">
                  Payment
                </p>
                <p className="text-[#1A1816]">
                  {formatOrderPaymentLabel(order)}
                  {order.paymentStatus ? ` · ${order.paymentStatus}` : ''}
                </p>
                {order.paymentDetails?.razorpayPaymentId && (
                  <p className="text-[11.5px] text-[#78736B] mt-0.5 break-all">
                    Ref: {order.paymentDetails.razorpayPaymentId}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#F6F3EC] border border-[#EAE5DC] p-6 h-fit">
            <h2 className="font-serif text-[20px] font-normal text-[#1A1816] mb-4">
              Payment Summary
            </h2>
            <div className="space-y-3 text-[13px] pb-4 border-b border-[#E5DFD3]">
              <div className="flex items-center justify-between text-[#5E5951]">
                <span>Subtotal</span>
                <span className="text-[#1A1816]">
                  {formatINR(order.subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#5E5951]">
                <span>Shipping</span>
                <span className="text-[#1A1816]">
                  {order.shippingFee === 0
                    ? 'Complimentary'
                    : formatINR(order.shippingFee)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 text-[16px] font-medium text-[#1A1816]">
              <span>Total Paid</span>
              <span>{formatINR(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </ProfileLayout>
  )
}

export default OrderDetails
