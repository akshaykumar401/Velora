import {
  RiCheckLine,
  RiDeleteBinLine,
  RiEditLine,
  RiMapPinLine,
} from '@remixicon/react'

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
  return (
    <article
      className={`p-5 sm:p-6 border flex flex-col justify-between gap-5 ${
        address.isDefault
          ? 'bg-[#F6F3EC] border-[#1A1816]/45'
          : 'bg-[#FCF9F2] border-[#E5DFD3]'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <RiMapPinLine
              size={15}
              className="text-[#1A1816] shrink-0"
              aria-hidden="true"
            />
            <h2 className="font-serif text-[19px] font-normal text-[#1A1816] truncate">
              {address.label}
            </h2>
          </div>

          {address.isDefault && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#151413] text-[#FCF9F2] text-[9.5px] tracking-[0.16em] uppercase shrink-0">
              <RiCheckLine size={11} aria-hidden="true" />
              <span>Default</span>
            </span>
          )}
        </div>

        <div className="text-[13px] leading-[1.65] text-[#5E5951] space-y-0.5">
          <p className="text-[#1A1816] font-medium">{address.recipient}</p>
          <p>{address.street}</p>
          <p>
            {address.city}, {address.region} {address.postalCode}
          </p>
          <p>{address.country}</p>
          {address.phone && <p className="pt-1 text-[12px]">{address.phone}</p>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-[#E5DFD3] text-[11px] tracking-[0.14em] uppercase">
        <button
          type="button"
          onClick={() => onEdit(address)}
          className="inline-flex items-center gap-1.5 text-[#1A1816] hover:opacity-70 transition-opacity cursor-pointer"
        >
          <RiEditLine size={13} aria-hidden="true" />
          <span>Edit</span>
        </button>

        {!address.isDefault && (
          <button
            type="button"
            onClick={() => onSetDefault(address.id)}
            className="text-[#5E5951] hover:text-[#1A1816] transition-colors cursor-pointer"
          >
            Set as Default
          </button>
        )}

        <button
          type="button"
          onClick={() => onDelete(address.id)}
          className="inline-flex items-center gap-1 text-[#7A5448] hover:text-[#1A1816] transition-colors ml-auto cursor-pointer"
        >
          <RiDeleteBinLine size={13} aria-hidden="true" />
          <span>Remove</span>
        </button>
      </div>
    </article>
  )
}

export default AddressCard

