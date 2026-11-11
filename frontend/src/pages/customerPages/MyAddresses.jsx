import { useState } from 'react'
import { RiAddLine } from '@remixicon/react'
import {
  AddressCard,
  AddressForm,
  ProfileLayout,
} from '../../components/profile'
import { useStore } from '../../features/store/storeContext.js'

const MyAddresses = () => {
  const { addresses, saveAddress, deleteAddress, setDefaultAddress } =
    useStore()
  const [formOpen, setFormOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)

  const handleOpenAdd = () => {
    setEditingAddress(null)
    setFormOpen(true)
  }

  const handleEdit = (addr) => {
    setEditingAddress(addr)
    setFormOpen(true)
  }

  const handleSave = (formValues) => {
    saveAddress(formValues)
    setFormOpen(false)
    setEditingAddress(null)
  }

  const handleCancel = () => {
    setFormOpen(false)
    setEditingAddress(null)
  }

  return (
    <ProfileLayout
      title="My Addresses"
      subtitle="Manage saved delivery destinations for expedited checkout."
    >
      <div>
        {!formOpen && (
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors cursor-pointer"
            >
              <RiAddLine size={15} aria-hidden="true" />
              <span>ADD NEW ADDRESS</span>
            </button>
          </div>
        )}

        {formOpen && (
          <AddressForm
            key={editingAddress?.id || 'new-address'}
            initialAddress={editingAddress}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        {addresses.length === 0 ? (
          <div className="border border-[#EAE5DC] bg-[#F6F3EC] p-10 text-center">
            <p className="font-serif text-[22px] text-[#1A1816] mb-2">
              No saved addresses
            </p>
            <p className="text-[13px] text-[#6D6860] mb-6">
              Add a delivery address for faster checkout across future orders.
            </p>
            {!formOpen && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-6 py-3 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase cursor-pointer"
              >
                ADD ADDRESS
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                onEdit={handleEdit}
                onDelete={deleteAddress}
                onSetDefault={setDefaultAddress}
              />
            ))}
          </div>
        )}
      </div>
    </ProfileLayout>
  )
}

export default MyAddresses
