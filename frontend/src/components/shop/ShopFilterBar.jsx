import {
  RiArrowDownSLine,
  RiCloseLine,
  RiEqualizerLine,
  RiSearchLine,
} from '@remixicon/react'

const ShopFilterBar = ({
  categories = [],
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="bg-[#FCF9F2] border-b border-[#EAE5DC]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0">
        {/* Category Tabs */}
        <div
          role="tablist"
          aria-label="Filter products by category"
          className="w-full max-w-full min-w-0 flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0"
        >
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.value
            return (
              <button
                key={cat.value}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onCategoryChange(cat.value)}
                className={`px-3.5 py-1.5 text-[11px] tracking-[0.14em] uppercase whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#151413] text-[#FCF9F2] font-medium'
                    : 'bg-transparent text-[#68635B] hover:text-[#1A1816] hover:bg-[#F2EDE4]'
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Inline Search + Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0 min-w-0">
          <div className="relative flex items-center w-full sm:w-52 min-w-0">
            <RiSearchLine
              size={14}
              className="text-[#8A847B] absolute left-3 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter pieces..."
              aria-label="Filter collection by keyword"
              className="w-full min-w-0 pl-8 pr-8 py-1.5 text-[12.5px] bg-[#F3EFE6] text-[#1A1816] placeholder:text-[#8E887F] rounded-md border border-transparent focus:border-[#D6CFC3] focus:bg-[#FAF7F0] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search filter"
                className="absolute right-2.5 text-[#78736B] hover:text-[#1A1816] cursor-pointer"
              >
                <RiCloseLine size={14} />
              </button>
            )}
          </div>

          <div className="relative flex items-center w-full sm:w-auto">
            <RiEqualizerLine
              size={14}
              className="text-[#6D6860] absolute left-3 pointer-events-none"
              aria-hidden="true"
            />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort products"
              className="w-full sm:w-auto appearance-none bg-[#F3EFE6] text-[#1A1816] text-[12px] tracking-[0.04em] pl-8 pr-8 py-1.5 rounded-md border border-transparent focus:border-[#D6CFC3] focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical</option>
            </select>
            <RiArrowDownSLine
              size={15}
              className="text-[#6D6860] absolute right-2.5 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopFilterBar

