const ShopHeader = ({ totalCount, activeCategoryLabel, searchQuery }) => {
  return (
    <section className="pt-12 pb-8 sm:pt-16 sm:pb-10 bg-[#FCF9F2] border-b border-[#EAE5DC]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-[580px]">
          <p className="text-[10px] tracking-[0.26em] uppercase text-[#8A8379] mb-2">
            CURATED ARCHIVE
          </p>
          <h1 className="font-serif text-[34px] sm:text-[44px] font-normal text-[#1A1816] leading-[1.1] mb-3">
            {activeCategoryLabel === 'All Pieces'
              ? 'The Collection'
              : activeCategoryLabel}
          </h1>
          <p className="text-[13px] leading-[1.7] text-[#666058]">
            Explore enduring silhouettes crafted from noble natural fibers,
            tailored outerwear, and architectural leather essentials.
          </p>
        </div>

        <p className="text-[11px] tracking-[0.18em] uppercase text-[#78736B] shrink-0">
          {totalCount} {totalCount === 1 ? 'Piece' : 'Pieces'}
          {searchQuery ? ` · “${searchQuery}”` : ''}
        </p>
      </div>
    </section>
  )
}

export default ShopHeader

