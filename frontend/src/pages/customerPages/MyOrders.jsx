import { Link } from 'react-router-dom'
import { OrderCard, ProfileLayout } from '../../components/profile'
import { useStore } from '../../features/store/storeContext.js'

const MyOrders = () => {
  const { orders } = useStore()

  return (
    <ProfileLayout
      title="My Orders"
      subtitle="Review past purchases, courier status, and detailed item receipts."
    >
      {orders.length === 0 ? (
        <div className="border border-[#EAE5DC] bg-[#F6F3EC] p-10 text-center">
          <p className="font-serif text-[24px] text-[#1A1816] mb-2">
            No orders placed yet
          </p>
          <p className="text-[13px] text-[#6D6860] mb-6">
            Explore our collection to place your first Velora atelier order.
          </p>
          <Link
            to="/shop"
            className="inline-block px-7 py-3.5 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase"
          >
            EXPLORE COLLECTION
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </ProfileLayout>
  )
}

export default MyOrders
