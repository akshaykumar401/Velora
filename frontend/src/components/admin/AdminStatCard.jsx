const AdminStatCard = ({ label, value, hint, Icon }) => {
  return (
    <div className="bg-[#F6F3EC] border border-[#EAE5DC] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8379]">
          {label}
        </p>
        {Icon && (
          <span className="w-8 h-8 rounded-full bg-[#FCF9F2] border border-[#EAE5DC] flex items-center justify-center text-[#1A1816] shrink-0">
            <Icon size={15} aria-hidden="true" />
          </span>
        )}
      </div>

      <p className="font-serif text-[32px] font-normal text-[#1A1816] leading-none mb-1.5">
        {value}
      </p>
      {hint && <p className="text-[11.5px] text-[#6D6860]">{hint}</p>}
    </div>
  )
}

export default AdminStatCard

