import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  RiAddCircleLine,
  RiAddLine,
  RiCheckLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiEditLine,
  RiSearchLine,
  RiSubtractLine,
} from '@remixicon/react'
import { AdminPageHeader } from '../../components/admin'
import { useAdmin } from '../../features/admin/adminContext.js'
import { formatINR } from '../../utils/currency.js'

const ManageProducts = () => {
  const { products, categories, updateProduct, deleteProduct } = useAdmin()
  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [draftName, setDraftName] = useState('')
  const [draftPrice, setDraftPrice] = useState('')
  const [draftStock, setDraftStock] = useState('')
  const [savingId, setSavingId] = useState('')
  const [error, setError] = useState('')

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter((item) => {
      const matchesDept =
        departmentFilter === 'all' || item.department === departmentFilter
      if (!matchesDept) return false
      if (!q) return true
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      )
    })
  }, [products, search, departmentFilter])

  const applyProductUpdate = async (id, patch) => {
    setError('')
    setSavingId(id)
    try {
      const result = await updateProduct(id, patch)
      if (result?.meta?.requestStatus === 'rejected') {
        setError(result.payload || 'Failed to update product')
        return false
      }
      return true
    } finally {
      setSavingId('')
    }
  }

  const startEdit = (product) => {
    setError('')
    setEditingId(product.id)
    setDraftName(product.name)
    setDraftPrice(String(product.price))
    setDraftStock(String(product.stock ?? 0))
  }

  const saveEdit = async (id) => {
    const parsedStock = Math.max(0, Math.floor(Number(draftStock) || 0))
    const ok = await applyProductUpdate(id, {
      name: draftName.trim() || 'Untitled Piece',
      price: Math.max(0, Number(draftPrice) || 0),
      stock: parsedStock,
    })
    if (ok) {
      setEditingId(null)
    }
  }

  const handleStepStock = (product, delta) => {
    const current = Number(product.stock ?? 0)
    const nextStock = Math.max(0, current + delta)
    if (nextStock === current) return
    applyProductUpdate(product.id, { stock: nextStock })
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="INVENTORY"
        title="Manage Products"
        subtitle="Search, update pricing, or remove garments across the Velora archive."
        action={
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors"
          >
            <RiAddCircleLine size={15} aria-hidden="true" />
            <span>ADD PRODUCT</span>
          </Link>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="relative flex items-center w-full sm:w-72 min-w-0">
          <RiSearchLine
            size={14}
            className="text-[#8A847B] absolute left-3 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            aria-label="Search inventory products"
            className="w-full min-w-0 pl-8 pr-3 py-2 text-[12.5px] bg-[#F3EFE6] text-[#1A1816] placeholder:text-[#8E887F] border border-transparent focus:border-[#D6CFC3] focus:bg-[#FCF9F2] focus:outline-none"
          />
        </div>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          aria-label="Filter by department"
          className="bg-[#F3EFE6] text-[#1A1816] text-[12px] px-3.5 py-2 border border-transparent focus:border-[#D6CFC3] focus:outline-none cursor-pointer"
        >
          <option value="all">All Departments</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 bg-[#EFE3DF] border border-[#C9A69C] px-4 py-3 text-[13px] text-[#6B2D22]"
        >
          {error}
        </div>
      )}

      {/* Product Rows */}
      <div className="border border-[#E5DFD3] bg-[#FCF9F2] divide-y divide-[#EAE5DC]">
        {filteredProducts.length === 0 ? (
          <div className="p-10 text-center text-[13px] text-[#6D6860]">
            No products match your search criteria.
          </div>
        ) : (
          filteredProducts.map((product) => {
            const isEditing = editingId === product.id
            const stockCount = Number(product.stock ?? 0)
            const isBusy = savingId === product.id
            return (
              <div
                key={product.id}
                className="p-4 sm:px-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-12 aspect-[4/4.8] bg-[#F2EDE4] overflow-hidden shrink-0">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full ${
                          product.placeholderTone ||
                          'bg-gradient-to-b from-[#EDE7DD] to-[#E2DACD]'
                        }`}
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[9.5px] tracking-[0.18em] uppercase text-[#8A8379]">
                      {product.category} · {product.department}
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        aria-label="Product name"
                        className="mt-1 w-full max-w-[320px] bg-[#F6F3EC] border border-[#1A1816] px-2.5 py-1 text-[13px] text-[#1A1816] focus:outline-none"
                      />
                    ) : (
                      <>
                        <p className="font-serif text-[17px] text-[#1A1816] truncate">
                          {product.name}
                        </p>
                        <p
                          className={`text-[11px] mt-0.5 ${
                            stockCount === 0
                              ? 'text-[#7A3528] font-medium'
                              : stockCount <= 5
                                ? 'text-[#8C5B2E]'
                                : 'text-[#6D6860]'
                          }`}
                        >
                          {stockCount === 0
                            ? 'Out of stock'
                            : `${stockCount} in stock`}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 sm:gap-4 shrink-0">
                  {isEditing ? (
                    <div className="flex flex-wrap items-end gap-2.5">
                      <div>
                        <label
                          htmlFor={`edit-price-${product.id}`}
                          className="block text-[9px] tracking-[0.16em] uppercase text-[#78736B] mb-1"
                        >
                          Price (INR ₹)
                        </label>
                        <input
                          id={`edit-price-${product.id}`}
                          type="number"
                          min="0"
                          value={draftPrice}
                          onChange={(e) => setDraftPrice(e.target.value)}
                          className="w-24 bg-[#F6F3EC] border border-[#1A1816] px-2.5 py-1 text-[13px] text-[#1A1816] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`edit-stock-${product.id}`}
                          className="block text-[9px] tracking-[0.16em] uppercase text-[#78736B] mb-1"
                        >
                          Total Stock
                        </label>
                        <input
                          id={`edit-stock-${product.id}`}
                          type="number"
                          min="0"
                          step="1"
                          value={draftStock}
                          onChange={(e) => setDraftStock(e.target.value)}
                          className="w-20 bg-[#F6F3EC] border border-[#1A1816] px-2.5 py-1 text-[13px] text-[#1A1816] focus:outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className="inline-flex items-center border border-[#D8D1C5] bg-[#F6F3EC]"
                        aria-label={`Adjust stock for ${product.name}`}
                      >
                        <button
                          type="button"
                          disabled={isBusy || stockCount <= 0}
                          onClick={() => handleStepStock(product, -1)}
                          aria-label={`Decrease stock for ${product.name}`}
                          className="px-2 py-1 text-[#5E5951] hover:text-[#1A1816] disabled:opacity-35 cursor-pointer"
                        >
                          <RiSubtractLine size={13} aria-hidden="true" />
                        </button>
                        <span className="px-2 text-[11.5px] font-medium text-[#1A1816] min-w-[34px] text-center">
                          {stockCount}
                        </span>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleStepStock(product, 1)}
                          aria-label={`Increase stock for ${product.name}`}
                          className="px-2 py-1 text-[#5E5951] hover:text-[#1A1816] disabled:opacity-35 cursor-pointer"
                        >
                          <RiAddLine size={13} aria-hidden="true" />
                        </button>
                      </div>

                      <span className="text-[14px] font-medium text-[#1A1816] min-w-[72px] text-right">
                        {formatINR(product.price)}
                      </span>
                    </>
                  )}

                  <div className="flex items-center gap-1.5">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => saveEdit(product.id)}
                          aria-label="Save changes"
                          className="p-2 bg-[#151413] text-[#FCF9F2] disabled:opacity-50 cursor-pointer"
                        >
                          <RiCheckLine size={15} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => setEditingId(null)}
                          aria-label="Cancel edit"
                          className="p-2 border border-[#CFC9BE] text-[#1A1816] cursor-pointer"
                        >
                          <RiCloseLine size={15} aria-hidden="true" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => startEdit(product)}
                          aria-label={`Edit ${product.name}`}
                          className="p-2 text-[#5E5951] hover:text-[#1A1816] cursor-pointer"
                        >
                          <RiEditLine size={16} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProduct(product.id)}
                          aria-label={`Delete ${product.name}`}
                          className="p-2 text-[#7A5448] hover:text-[#1A1816] cursor-pointer"
                        >
                          <RiDeleteBinLine size={16} aria-hidden="true" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ManageProducts

