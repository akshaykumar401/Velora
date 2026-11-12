import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppSelector } from '../../App/hooks.js'
import { ShopFilterBar, ShopGrid, ShopHeader } from '../../components/shop'
import { productMatchesCategory } from '../../utils/catalog.js'

const ALL_CATEGORIES_OPTION = [{ label: 'All Pieces', value: 'all' }]

const Shop = () => {
  const { products, categories } = useAppSelector((state) => state.catalog)
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || 'all'
  const initialSearch = searchParams.get('search') || ''

  const [sortBy, setSortBy] = useState('featured')

  const filterOptions = useMemo(() => {
    const baseValues = new Set(ALL_CATEGORIES_OPTION.map((opt) => opt.value))
    const dynamicExtras = categories
      .filter((cat) => !baseValues.has(cat.slug))
      .map((cat) => ({ label: cat.title, value: cat.slug }))
    return [...ALL_CATEGORIES_OPTION, ...dynamicExtras]
  }, [categories])

  const activeCategory = filterOptions.some(
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

  const activeCategoryObj = useMemo(
    () =>
      categories.find((cat) => cat.slug === activeCategory) || activeCategory,
    [categories, activeCategory],
  )

  const filteredProducts = useMemo(() => {
    const normalizedQuery = initialSearch.trim().toLowerCase()

    const matching = products.filter((product) => {
      const matchesCategory =
        activeCategory === 'all' ||
        productMatchesCategory(product, activeCategoryObj)

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
  }, [products, activeCategory, activeCategoryObj, initialSearch, sortBy])

  const activeCategoryLabel =
    filterOptions.find((opt) => opt.value === activeCategory)?.label ||
    'All Pieces'

  return (
    <>
      <ShopHeader
        totalCount={filteredProducts.length}
        activeCategoryLabel={activeCategoryLabel}
        searchQuery={initialSearch.trim()}
      />
      <ShopFilterBar
        categories={filterOptions}
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
