import { Link, useParams } from 'react-router-dom'
import { RiArrowLeftLine } from '@remixicon/react'
import { AdminPageHeader } from '../../components/admin'
import { ORDER_STATUS_OPTIONS } from '../../data/adminData.js'
import { getProductById } from '../../data/catalogData.js'
import { useAdmin } from '../../features/admin/adminContext.js'

const OrderDetails = () => {
  const { id } = useParams()
  const { orders, getAdminOrderById, updateOrderStatus } = useAdmin()
  const order = id ? getAdminOrderById(id) : orders[0]

  if (!order) {
    return (
      <div>
        <AdminPageHeader
          eyebrow="ORDER RECORD"
          title="Order Not Found"
          subtitle={`No order matching ${id} exists in the atelier ledger.`}
        />
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase"
        >
          <RiArrowLeftLine size={14} aria-hidden="true" />
          <span>BACK TO ORDERS</span>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-[#4B463F] hover:text-[#1A1816]"
        >
          <RiArrowLeftLine size={14} aria-hidden="true" />
          <span>ALL ORDERS</span>
        </Link>
      </div>

      <AdminPageHeader
        eyebrow="ORDER FULFILLMENT"
        title={`Order ${order.id}`}
        subtitle={`Placed on ${order.createdAt} by ${order.customerName}`}
        action={
          <div className="flex items-center gap-2.5">
            <label
              htmlFor="admin-order-status"
              className="text-[10px] tracking-[0.16em] uppercase text-[#78736B]"
            >
              Status
            </label>
            <select
              id="admin-order-status"
              value={order.status}
              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
              className="bg-[#F6F3EC] border border-[#D8D1C5] px-3.5 py-2 text-[12px] text-[#1A1816] focus:border-[#1A1816] focus:outline-none cursor-pointer"
            >
              {ORDER_STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items */}
        <div className="lg:col-span-8 border border-[#E5DFD3] bg-[#FCF9F2] min-w-0">
          <div className="px-5 py-4 border-b border-[#EAE5DC]">
            <h2 className="font-serif text-[20px] font-normal text-[#1A1816]">
              Line Items
            </h2>
          </div>

          <div className="divide-y divide-[#EAE5DC]">
            {order.items.map((item, idx) => {
              const catalogItem = getProductById(item.productId)
              return (
                <div
                  key={`${item.productId}-${idx}`}
                  className="p-5 flex items-center gap-4"
                >
                  <div className="w-14 aspect-[4/4.8] bg-[#F2EDE4] overflow-hidden shrink-0">
                    {catalogItem?.image ? (
                      <img
                        src={catalogItem.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full ${
                          catalogItem?.placeholderTone ||
                          'bg-gradient-to-b from-[#EDE7DD] to-[#E2DACD]'
                        }`}
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[9.5px] tracking-[0.18em] uppercase text-[#8A8379]">
                      {item.category}
                    </p>
                    <p className="font-serif text-[17px] text-[#1A1816] truncate">
                      {item.name}
                    </p>
                    <p className="text-[12px] text-[#6D6860]">
                      {item.color} · Size {item.size} · Qty {item.quantity}
                    </p>
                  </div>

                  <p className="text-[14px] font-medium text-[#1A1816] shrink-0">
                    ${item.price * item.quantity}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Client & Payment */}
        <div className="lg:col-span-4 space-y-6 min-w-0">
          <div className="border border-[#E5DFD3] bg-[#FCF9F2] p-5 sm:p-6">
            <h2 className="font-serif text-[20px] font-normal text-[#1A1816] mb-4">
              Client &amp; Dispatch
            </h2>
            <div className="text-[13px] leading-[1.7] text-[#5E5951] space-y-3">
              <div>
                <p className="text-[10px] tracking-[0.16em] uppercase text-[#8A8379]">
                  Customer
                </p>
                <p className="text-[#1A1816] font-medium">
                  {order.customerName}
                </p>
                <p className="break-all">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.16em] uppercase text-[#8A8379]">
                  Shipping Destination
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
                  Courier &amp; Payment
                </p>
                <p>
                  {order.deliveryMethod} · Card ****{order.paymentLast4}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#F6F3EC] border border-[#EAE5DC] p-5 sm:p-6">
            <h2 className="font-serif text-[20px] font-normal text-[#1A1816] mb-4">
              Financial Summary
            </h2>
            <div className="space-y-2.5 text-[13px] pb-4 border-b border-[#E5DFD3]">
              <div className="flex justify-between text-[#5E5951]">
                <span>Subtotal</span>
                <span className="text-[#1A1816]">${order.subtotal}</span>
              </div>
              <div className="flex justify-between text-[#5E5951]">
                <span>Shipping</span>
                <span className="text-[#1A1816]">
                  {order.shippingFee === 0
                    ? 'Complimentary'
                    : `$${order.shippingFee}`}
                </span>
              </div>
            </div>
            <div className="flex justify-between pt-4 text-[16px] font-medium text-[#1A1816]">
              <span>Total</span>
              <span>${order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails

