import { useState } from 'react'
import { RiCheckLine, RiDeleteBinLine } from '@remixicon/react'
import { AdminPageHeader } from '../../components/admin'
import { useAdmin } from '../../features/admin/adminContext.js'

const inputClass =
  'w-full min-w-0 bg-[#FCF9F2] border border-[#D8D1C5] px-3.5 py-2.5 text-[13px] text-[#1A1816] placeholder:text-[#969087] focus:border-[#1A1816] focus:outline-none transition-colors'

const labelClass =
  'block text-[10px] tracking-[0.18em] uppercase text-[#78736B] mb-1.5'

const AddCategory = () => {
  const { categories, addCategory, deleteCategory } = useAdmin()
  const [form, setForm] = useState({
    title: '',
    slug: '',
    indexLabel: '07 / CAPSULE',
    subtitle: '',
    featured: false,
  })
  const [createdName, setCreatedName] = useState('')

  const handleTitleChange = (val) => {
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setForm((prev) => ({ ...prev, title: val, slug: autoSlug }))
    if (createdName) setCreatedName('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const created = addCategory(form)
    setCreatedName(created.title)
    setForm({
      title: '',
      slug: '',
      indexLabel: `${String(categories.length + 2).padStart(2, '0')} / CAPSULE`,
      subtitle: '',
      featured: false,
    })
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="TAXONOMY"
        title="Add Category"
        subtitle="Create and organize storefront departments and curated capsules."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form */}
        <div className="lg:col-span-6 min-w-0">
          {createdName && (
            <div className="mb-5 bg-[#F6F3EC] border border-[#1A1816]/35 px-4 py-3 flex items-center gap-2 text-[13px] text-[#1A1816]">
              <RiCheckLine size={16} aria-hidden="true" />
              <span>Category “{createdName}” created.</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-[#F6F3EC] border border-[#EAE5DC] p-5 sm:p-7 space-y-5"
          >
            <div>
              <label htmlFor="cat-title" className={labelClass}>
                Category Title
              </label>
              <input
                id="cat-title"
                type="text"
                required
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Footwear"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cat-slug" className={labelClass}>
                  URL Slug
                </label>
                <input
                  id="cat-slug"
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="footwear"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="cat-index" className={labelClass}>
                  Index Label
                </label>
                <input
                  id="cat-index"
                  type="text"
                  value={form.indexLabel}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, indexLabel: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="cat-subtitle" className={labelClass}>
                Editorial Subtitle
              </label>
              <textarea
                id="cat-subtitle"
                rows={3}
                required
                value={form.subtitle}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, subtitle: e.target.value }))
                }
                placeholder="Short description shown on the Categories page..."
                className={inputClass}
              />
            </div>

            <label className="inline-flex items-center gap-2.5 text-[12.5px] text-[#4B463F] cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, featured: e.target.checked }))
                }
                className="accent-[#151413]"
              />
              <span>Feature in Home Curated Selection</span>
            </label>

            <div>
              <button
                type="submit"
                className="px-7 py-3.5 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors cursor-pointer"
              >
                CREATE CATEGORY
              </button>
            </div>
          </form>
        </div>

        {/* Existing Categories List */}
        <div className="lg:col-span-6 border border-[#E5DFD3] bg-[#FCF9F2] min-w-0">
          <div className="px-5 py-4 border-b border-[#EAE5DC]">
            <h2 className="font-serif text-[20px] font-normal text-[#1A1816]">
              Active Categories ({categories.length})
            </h2>
          </div>

          <div className="divide-y divide-[#EAE5DC]">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 sm:px-5 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-[9.5px] tracking-[0.18em] uppercase text-[#8A8379]">
                    {cat.indexLabel} · /{cat.slug}
                  </p>
                  <p className="font-serif text-[18px] text-[#1A1816]">
                    {cat.title}
                  </p>
                  <p className="text-[12px] text-[#666058] mt-0.5">
                    {cat.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => deleteCategory(cat.id)}
                  aria-label={`Delete ${cat.title}`}
                  className="p-1.5 text-[#7A5448] hover:text-[#1A1816] transition-colors shrink-0 cursor-pointer"
                >
                  <RiDeleteBinLine size={16} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddCategory

