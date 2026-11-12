import { Link } from 'react-router-dom'
import {
  RiAddCircleLine,
  RiArrowRightLine,
  RiFileList3Line,
  RiFolderAddLine,
  RiImageEditLine,
  RiPriceTag3Line,
  RiShoppingBag3Line,
  RiStarLine,
} from '@remixicon/react'
import { AdminPageHeader, AdminStatCard } from '../../components/admin'
import { useAdmin } from '../../features/admin/adminContext.js'
import { formatINR } from '../../utils/currency.js'

const AdminDashboard = () => {
  const { products, categories, orders, reviews } = useAdmin()

  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, order) => sum + order.total, 0)

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'In Preparation' || o.status === 'Shipped',
  ).length

  const pendingReviewsCount = reviews.filter(
    (r) => r.status === 'Pending',
  ).length

  return (
    <div>
      <AdminPageHeader
        eyebrow="OVERVIEW"
        title="Atelier Dashboard"
        subtitle="Real-time view across revenue, fulfillment queue, catalog pieces, and client reviews."
        action={
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors"
          >
            <RiAddCircleLine size={15} aria-hidden="true" />
            <span>NEW PRODUCT</span>
          </Link>
        }
      />

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-10">
        <AdminStatCard
          label="Total Revenue"
          value={formatINR(totalRevenue)}
          hint={`${orders.length} orders recorded`}
          Icon={RiShoppingBag3Line}
        />
        <AdminStatCard
          label="Active Fulfillment"
          value={activeOrdersCount}
          hint="In preparation or in transit"
          Icon={RiFileList3Line}
        />
        <AdminStatCard
          label="Catalog Pieces"
          value={products.length}
          hint={`Across ${categories.length} departments`}
          Icon={RiPriceTag3Line}
        />
        <AdminStatCard
          label="Pending Reviews"
          value={pendingReviewsCount}
          hint={`${reviews.length} total client reviews`}
          Icon={RiStarLine}
        />
      </div>

      {/* Recent Orders + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-8 border border-[#E5DFD3] bg-[#FCF9F2] min-w-0">
          <div className="px-5 py-4 border-b border-[#EAE5DC] flex items-center justify-between gap-3">
            <h2 className="font-serif text-[21px] font-normal text-[#1A1816]">
              Recent Orders
            </h2>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1.5 text-[10.5px] tracking-[0.16em] uppercase text-[#1A1816] hover:opacity-70"
            >
              <span>MANAGE ALL</span>
              <RiArrowRightLine size={13} aria-hidden="true" />
            </Link>
          </div>

          <div className="divide-y divide-[#EAE5DC]">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="font-medium text-[13px] text-[#1A1816] hover:underline underline-offset-4"
                  >
                    {order.id}
                  </Link>
                  <p className="text-[12px] text-[#6D6860] truncate">
                    {order.customerName} · {order.createdAt}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="px-2.5 py-1 bg-[#F3EFE6] text-[10px] tracking-[0.14em] uppercase text-[#1A1816]">
                    {order.status}
                  </span>
                  <span className="text-[13.5px] font-medium text-[#1A1816] min-w-[72px] text-right">
                    {formatINR(order.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-4 space-y-4 min-w-0">
          <div className="bg-[#F6F3EC] border border-[#EAE5DC] p-5 sm:p-6">
            <h2 className="font-serif text-[21px] font-normal text-[#1A1816] mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2.5">
              <Link
                to="/admin/products/new"
                className="flex items-center justify-between px-4 py-3 bg-[#FCF9F2] border border-[#E5DFD3] hover:border-[#1A1816] text-[12px] text-[#1A1816] transition-colors"
              >
                <span className="inline-flex items-center gap-2.5">
                  <RiAddCircleLine size={15} aria-hidden="true" />
                  <span>Add New Product</span>
                </span>
                <RiArrowRightLine size={14} aria-hidden="true" />
              </Link>

              <Link
                to="/admin/categories/new"
                className="flex items-center justify-between px-4 py-3 bg-[#FCF9F2] border border-[#E5DFD3] hover:border-[#1A1816] text-[12px] text-[#1A1816] transition-colors"
              >
                <span className="inline-flex items-center gap-2.5">
                  <RiFolderAddLine size={15} aria-hidden="true" />
                  <span>Create Category</span>
                </span>
                <RiArrowRightLine size={14} aria-hidden="true" />
              </Link>

              <Link
                to="/admin/reviews"
                className="flex items-center justify-between px-4 py-3 bg-[#FCF9F2] border border-[#E5DFD3] hover:border-[#1A1816] text-[12px] text-[#1A1816] transition-colors"
              >
                <span className="inline-flex items-center gap-2.5">
                  <RiStarLine size={15} aria-hidden="true" />
                  <span>Moderate Client Reviews</span>
                </span>
                <RiArrowRightLine size={14} aria-hidden="true" />
              </Link>

              <Link
                to="/admin/storefront"
                className="flex items-center justify-between px-4 py-3 bg-[#FCF9F2] border border-[#E5DFD3] hover:border-[#1A1816] text-[12px] text-[#1A1816] transition-colors"
              >
                <span className="inline-flex items-center gap-2.5">
                  <RiImageEditLine size={15} aria-hidden="true" />
                  <span>Customize Hero Image</span>
                </span>
                <RiArrowRightLine size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AdminDashboard

