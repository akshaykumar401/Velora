import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShopFilterBar, ShopGrid, ShopHeader } from '../../components/shop'
import { PRODUCTS, SHOP_FILTER_OPTIONS } from '../../data/catalogData.js'

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || 'all'
  const initialSearch = searchParams.get('search') || ''

  const [sortBy, setSortBy] = useState('featured')

  const activeCategory = SHOP_FILTER_OPTIONS.some(
    (opt) => opt.value === initialCategory,
  )
    ? initialCategory
    : 'all'

  const handleCategoryChange = (value) => {
    const next = new URLSearchParams(searchParams)
    if (value === 'all') {
      next.delete('category')
    } else {
      next.set('category', value)
    }
    setSearchParams(next)
  }

  const handleSearchChange = (value) => {
    const next = new URLSearchParams(searchParams)
    if (!value) {
      next.delete('search')
    } else {
      next.set('search', value)
    }
    setSearchParams(next)
  }

  const handleResetFilters = () => {
    setSortBy('featured')
    setSearchParams({})
  }

  const filteredProducts = useMemo(() => {
    const normalizedQuery = initialSearch.trim().toLowerCase()

    const matching = PRODUCTS.filter((product) => {
      const matchesCategory =
        activeCategory === 'all' ||
        product.department === activeCategory ||
        product.tags?.includes(activeCategory)

      if (!matchesCategory) return false

      if (!normalizedQuery) return true

      return (
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery)
      )
    })

    return [...matching].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
      return (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0)
    })
  }, [activeCategory, initialSearch, sortBy])

  const activeCategoryLabel =
    SHOP_FILTER_OPTIONS.find((opt) => opt.value === activeCategory)?.label ||
    'All Pieces'

  return (
    <>
      <ShopHeader
        totalCount={filteredProducts.length}
        activeCategoryLabel={activeCategoryLabel}
        searchQuery={initialSearch.trim()}
      />
      <ShopFilterBar
        categories={SHOP_FILTER_OPTIONS}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        searchQuery={initialSearch}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <ShopGrid
        products={filteredProducts}
        onResetFilters={handleResetFilters}
      />
    </>
  )
}

export default Shop
