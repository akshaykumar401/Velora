import { Link } from 'react-router-dom'
import { RiArrowRightLine } from '@remixicon/react'
import { getProductById } from '../../data/catalogData.js'

const OrderCard = ({ order }) => {
  const totalCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <article className="border border-[#E5DFD3] bg-[#FCF9F2] p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE5DC]">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8379] mb-1">
            ORDER {order.id}
          </p>
          <p className="text-[12.5px] text-[#5E5951]">
            Placed on {order.createdAt} · {totalCount}{' '}
            {totalCount === 1 ? 'piece' : 'pieces'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-[#F3EFE6] text-[10px] tracking-[0.16em] uppercase text-[#1A1816]">
            {order.status}
          </span>
          <span className="font-serif text-[19px] text-[#1A1816]">
            ${order.total}
          </span>
        </div>
      </div>

      <div className="py-4 flex flex-wrap items-center gap-3">
        {order.items.map((item, idx) => {
          const catalogMatch = getProductById(item.productId)
          return (
            <div
              key={`${item.productId}-${idx}`}
              className="flex items-center gap-3 pr-4"
            >
              <div className="w-12 aspect-[4/4.8] bg-[#F2EDE4] overflow-hidden shrink-0">
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
              </div>
              <div className="min-w-0">
                <p className="font-serif text-[14.5px] text-[#1A1816] leading-snug">
                  {item.name}
                </p>
                <p className="text-[11px] text-[#78736B]">
                  {item.color} · {item.size} × {item.quantity}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="pt-3 border-t border-[#EAE5DC] flex justify-end">
        <Link
          to={`/orders/${order.id}`}
          className="inline-flex items-center gap-2 text-[10.5px] font-medium tracking-[0.18em] uppercase text-[#1A1816] hover:opacity-70 transition-opacity"
        >
          <span>VIEW ORDER DETAILS</span>
          <RiArrowRightLine size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

export default OrderCard

