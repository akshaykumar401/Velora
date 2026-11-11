import { Link } from 'react-router-dom'
import { RiArrowRightLine, RiEditLine } from '@remixicon/react'
import { ClerkProfileBanner } from '../../components/auth'
import { ProfileLayout } from '../../components/profile'
import { useStore } from '../../features/store/storeContext.js'

const MyProfile = () => {
  const { profile, addresses, orders, wishlistCount, cartCount } = useStore()
  const defaultAddress =
    addresses.find((addr) => addr.isDefault) || addresses[0] || null
  const latestOrder = orders[0] || null

  return (
    <ProfileLayout
      title={`Welcome, ${profile.fullName.split(' ')[0]}`}
      subtitle="Manage your personal details, saved addresses, and atelier order history."
    >
      <div className="space-y-8">
        <ClerkProfileBanner />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/orders"
            className="p-5 bg-[#F6F3EC] border border-[#EAE5DC] hover:border-[#1A1816]/40 transition-colors"
          >
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8379] mb-1.5">
              ORDERS
            </p>
            <p className="font-serif text-[28px] text-[#1A1816] leading-none">
              {orders.length}
            </p>
          </Link>

          <Link
            to="/wishlist"
            className="p-5 bg-[#F6F3EC] border border-[#EAE5DC] hover:border-[#1A1816]/40 transition-colors"
          >
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8379] mb-1.5">
              SAVED WISHLIST
            </p>
            <p className="font-serif text-[28px] text-[#1A1816] leading-none">
              {wishlistCount}
            </p>
          </Link>

          <Link
            to="/cart"
            className="p-5 bg-[#F6F3EC] border border-[#EAE5DC] hover:border-[#1A1816]/40 transition-colors"
          >
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8379] mb-1.5">
              ACTIVE BAG
            </p>
            <p className="font-serif text-[28px] text-[#1A1816] leading-none">
              {cartCount}
            </p>
          </Link>
        </div>

        {/* Profile & Default Address Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-[#E5DFD3] p-6 flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="font-serif text-[22px] font-normal text-[#1A1816]">
                  Client Details
                </h2>
                <Link
                  to="/profile/edit"
                  className="inline-flex items-center gap-1.5 text-[10.5px] tracking-[0.16em] uppercase text-[#1A1816] hover:opacity-70 transition-opacity"
                >
                  <RiEditLine size={13} aria-hidden="true" />
                  <span>Edit</span>
                </Link>
              </div>

              <dl className="space-y-2.5 text-[13px]">
                <div>
                  <dt className="text-[10px] tracking-[0.16em] uppercase text-[#8A8379]">
                    Full Name
                  </dt>
                  <dd className="text-[#1A1816]">{profile.fullName}</dd>
                </div>
                <div>
                  <dt className="text-[10px] tracking-[0.16em] uppercase text-[#8A8379]">
                    Email
                  </dt>
                  <dd className="text-[#1A1816] break-all">{profile.email}</dd>
                </div>
                <div>
                  <dt className="text-[10px] tracking-[0.16em] uppercase text-[#8A8379]">
                    Phone
                  </dt>
                  <dd className="text-[#1A1816]">{profile.phone || '—'}</dd>
                </div>
                <div>
                  <dt className="text-[10px] tracking-[0.16em] uppercase text-[#8A8379]">
                    Preferred Fit Size
                  </dt>
                  <dd className="text-[#1A1816]">{profile.preferredSize}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="border border-[#E5DFD3] p-6 flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="font-serif text-[22px] font-normal text-[#1A1816]">
                  Default Address
                </h2>
                <Link
                  to="/addresses"
                  className="text-[10.5px] tracking-[0.16em] uppercase text-[#1A1816] hover:opacity-70 transition-opacity"
                >
                  Manage
                </Link>
              </div>

              {defaultAddress ? (
                <div className="text-[13px] leading-[1.7] text-[#5E5951]">
                  <p className="text-[#1A1816] font-medium mb-1">
                    {defaultAddress.label}
                  </p>
                  <p>{defaultAddress.recipient}</p>
                  <p>{defaultAddress.street}</p>
                  <p>
                    {defaultAddress.city}, {defaultAddress.region}{' '}
                    {defaultAddress.postalCode}
                  </p>
                  <p>{defaultAddress.country}</p>
                </div>
              ) : (
                <p className="text-[13px] text-[#6D6860]">
                  No shipping address saved yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Latest Order Snapshot */}
        {latestOrder && (
          <div className="bg-[#F6F3EC] border border-[#EAE5DC] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8379] mb-1">
                RECENT ORDER
              </p>
              <p className="font-serif text-[20px] text-[#1A1816]">
                Order {latestOrder.id} · {latestOrder.status}
              </p>
              <p className="text-[12.5px] text-[#666058]">
                Placed {latestOrder.createdAt} · Total ${latestOrder.total}
              </p>
            </div>

            <Link
              to={`/orders/${latestOrder.id}`}
              className="inline-flex items-center gap-2 text-[10.5px] font-medium tracking-[0.18em] uppercase text-[#1A1816] hover:opacity-70 transition-opacity self-start sm:self-auto"
            >
              <span>VIEW ORDER</span>
              <RiArrowRightLine size={14} aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </ProfileLayout>
  )
}

export default MyProfile
