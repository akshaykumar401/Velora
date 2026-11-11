const AdminPageHeader = ({ eyebrow = 'ATELIER ADMIN', title, subtitle, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-[#EAE5DC]">
      <div className="min-w-0">
        <p className="text-[10px] tracking-[0.24em] uppercase text-[#8A8379] mb-1.5">
          {eyebrow}
        </p>
        <h1 className="font-serif text-[30px] sm:text-[36px] font-normal text-[#1A1816] leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13px] text-[#666058] mt-1.5 max-w-[540px]">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export default AdminPageHeader

