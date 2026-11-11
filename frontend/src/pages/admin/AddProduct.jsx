import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RiCheckLine } from '@remixicon/react'
import { AdminPageHeader } from '../../components/admin'
import { useAdmin } from '../../features/admin/adminContext.js'

const inputClass =
  'w-full min-w-0 bg-[#FCF9F2] border border-[#D8D1C5] px-3.5 py-2.5 text-[13px] text-[#1A1816] placeholder:text-[#969087] focus:border-[#1A1816] focus:outline-none transition-colors'

const labelClass =
  'block text-[10px] tracking-[0.18em] uppercase text-[#78736B] mb-1.5'

const INITIAL_PRODUCT = {
  name: '',
  category: 'CASHMERE KNITWEAR',
  department: 'women',
  price: '',
  description: '',
  fabric: '',
  care: '',
  sizes: 'XS, S, M, L',
  colorName: 'Oatmeal',
  colorHex: '#D6CCB9',
  image: '',
}

const AddProduct = () => {
  const { categories, addProduct } = useAdmin()
  const [form, setForm] = useState(INITIAL_PRODUCT)
  const [createdProduct, setCreatedProduct] = useState(null)

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (createdProduct) setCreatedProduct(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const parsedSizes = form.sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const saved = addProduct({
      name: form.name.trim(),
      category: form.category.trim().toUpperCase(),
      department: form.department,
      tags: [form.department],
      price: Number(form.price) || 0,
      description: form.description.trim(),
      fabric: form.fabric.trim(),
      care: form.care.trim(),
      sizes: parsedSizes.length > 0 ? parsedSizes : ['One Size'],
      colors: [{ name: form.colorName.trim() || 'Default', hex: form.colorHex }],
      image: form.image.trim() || null,
    })

    setCreatedProduct(saved)
    setForm(INITIAL_PRODUCT)
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="CATALOG CREATION"
        title="Add New Product"
        subtitle="Publish a garment or leather piece to the Velora atelier inventory."
        action={
          <Link
            to="/admin/products"
            className="inline-block px-5 py-3 border border-[#CFC9BE] text-[10.5px] font-medium tracking-[0.2em] uppercase text-[#1A1816] hover:border-[#1A1816] transition-colors"
          >
            MANAGE PRODUCTS
          </Link>
        }
      />

      {createdProduct && (
        <div className="mb-6 bg-[#F6F3EC] border border-[#1A1816]/35 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-[13px] text-[#1A1816]">
            <RiCheckLine size={16} aria-hidden="true" />
            <span>
              <strong>{createdProduct.name}</strong> added to catalog.
            </span>
          </p>
          <Link
            to="/admin/products"
            className="text-[10.5px] tracking-[0.18em] uppercase text-[#1A1816] underline underline-offset-4"
          >
            VIEW IN INVENTORY
          </Link>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-[780px] bg-[#F6F3EC] border border-[#EAE5DC] p-5 sm:p-8 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="prod-name" className={labelClass}>
              Product Name
            </label>
            <input
              id="prod-name"
              type="text"
              required
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Sculpted Cashmere Wrap Coat"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="prod-category" className={labelClass}>
              Category Eyebrow
            </label>
            <input
              id="prod-category"
              type="text"
              required
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="e.g. OUTERWEAR"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="prod-department" className={labelClass}>
              Department
            </label>
            <select
              id="prod-department"
              value={form.department}
              onChange={(e) => handleChange('department', e.target.value)}
              className={inputClass}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="prod-price" className={labelClass}>
              Price (USD)
            </label>
            <input
              id="prod-price"
              type="number"
              min="1"
              required
              value={form.price}
              onChange={(e) => handleChange('price', e.target.value)}
              placeholder="480"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="prod-sizes" className={labelClass}>
              Sizes (Comma Separated)
            </label>
            <input
              id="prod-sizes"
              type="text"
              value={form.sizes}
              onChange={(e) => handleChange('sizes', e.target.value)}
              placeholder="XS, S, M, L"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="prod-color-name" className={labelClass}>
              Primary Color Name
            </label>
            <input
              id="prod-color-name"
              type="text"
              value={form.colorName}
              onChange={(e) => handleChange('colorName', e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="prod-color-hex" className={labelClass}>
              Color Swatch Hex
            </label>
            <div className="flex items-center gap-2.5">
              <input
                id="prod-color-hex"
                type="color"
                value={form.colorHex}
                onChange={(e) => handleChange('colorHex', e.target.value)}
                className="w-11 h-10 p-0.5 bg-[#FCF9F2] border border-[#D8D1C5] cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={form.colorHex}
                onChange={(e) => handleChange('colorHex', e.target.value)}
                aria-label="Color hex value"
                className={inputClass}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="prod-image" className={labelClass}>
              Image URL (Optional)
            </label>
            <input
              id="prod-image"
              type="url"
              value={form.image}
              onChange={(e) => handleChange('image', e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="prod-desc" className={labelClass}>
              Editorial Description
            </label>
            <textarea
              id="prod-desc"
              rows={3}
              required
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe silhouette, drape, and craftsmanship..."
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="prod-fabric" className={labelClass}>
              Material &amp; Provenance
            </label>
            <input
              id="prod-fabric"
              type="text"
              value={form.fabric}
              onChange={(e) => handleChange('fabric', e.target.value)}
              placeholder="100% Cashmere · Biella, Italy"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="prod-care" className={labelClass}>
              Care Instructions
            </label>
            <input
              id="prod-care"
              type="text"
              value={form.care}
              onChange={(e) => handleChange('care', e.target.value)}
              placeholder="Dry clean or hand wash cold"
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-7 py-3.5 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors cursor-pointer"
        >
          PUBLISH PRODUCT
        </button>
      </form>
    </div>
  )
}

export default AddProduct

