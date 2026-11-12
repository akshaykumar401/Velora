import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { RiArrowRightLine, RiSearchLine } from '@remixicon/react'
import { AdminPageHeader } from '../../components/admin'
import { useAdmin } from '../../features/admin/adminContext.js'
import { ORDER_STATUS_OPTIONS } from '../../utils/catalog.js'
import { formatINR } from '../../utils/currency.js'

const STATUS_TABS = ['All', ...ORDER_STATUS_OPTIONS]

const ManageOrders = () => {
  const { orders, updateOrderStatus } = useAdmin()
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === 'All' || order.status === statusFilter
      if (!matchesStatus) return false
      if (!q) return true
      return (
        order.id.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerEmail.toLowerCase().includes(q)
      )
    })
  }, [orders, statusFilter, search])

  return (
    <div>
      <AdminPageHeader
        eyebrow="FULFILLMENT"
        title="Manage Orders"
        subtitle="Track order progress, update courier statuses, and inspect itemized receipts."
      />

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="w-full max-w-full min-w-0 flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          {STATUS_TABS.map((status) => {
            const active = statusFilter === status
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 text-[11px] tracking-[0.14em] uppercase whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#151413] text-[#FCF9F2] font-medium'
                    : 'bg-[#F3EFE6] text-[#68635B] hover:text-[#1A1816]'
                }`}
              >
                {status}
              </button>
            )
          })}
        </div>

        <div className="relative flex items-center w-full lg:w-64 shrink-0 min-w-0">
          <RiSearchLine
            size={14}
            className="text-[#8A847B] absolute left-3 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order or client..."
            aria-label="Search orders"
            className="w-full min-w-0 pl-8 pr-3 py-2 text-[12.5px] bg-[#F3EFE6] text-[#1A1816] placeholder:text-[#8E887F] border border-transparent focus:border-[#D6CFC3] focus:bg-[#FCF9F2] focus:outline-none"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="border border-[#E5DFD3] bg-[#FCF9F2] divide-y divide-[#EAE5DC]">
        {filteredOrders.length === 0 ? (
          <div className="p-10 text-center text-[13px] text-[#6D6860]">
            No orders found for the current filter.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const itemCount = order.items.reduce(
              (sum, item) => sum + item.quantity,
              0,
            )
            return (
              <div
                key={order.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5 mb-1">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="font-medium text-[13.5px] text-[#1A1816] hover:underline underline-offset-4"
                    >
                      {order.id}
                    </Link>
                    <span className="text-[11px] text-[#8A8379]">
                      · {order.createdAt}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#4B463F] truncate">
                    {order.customerName} ({order.customerEmail})
                  </p>
                  <p className="text-[11.5px] text-[#78736B] mt-0.5">
                    {itemCount} {itemCount === 1 ? 'piece' : 'pieces'} ·{' '}
                    {order.deliveryMethod}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 sm:gap-4 shrink-0">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                    aria-label={`Order status for ${order.id}`}
                    className="bg-[#F6F3EC] border border-[#D8D1C5] px-3 py-1.5 text-[11.5px] text-[#1A1816] focus:border-[#1A1816] focus:outline-none cursor-pointer"
                  >
                    {ORDER_STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  <span className="text-[14px] font-medium text-[#1A1816] min-w-[72px] text-right">
                    {formatINR(order.total)}
                  </span>

                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 text-[10.5px] font-medium tracking-[0.16em] uppercase text-[#1A1816] hover:opacity-70"
                  >
                    <span>DETAILS</span>
                    <RiArrowRightLine size={13} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ManageOrders

