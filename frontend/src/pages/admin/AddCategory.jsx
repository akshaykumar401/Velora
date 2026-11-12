import { useState } from 'react'
import {
  RiCheckLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiEditLine,
} from '@remixicon/react'
import { AdminImageField, AdminPageHeader } from '../../components/admin'
import { useAdmin } from '../../features/admin/adminContext.js'
import { toCategorySlug } from '../../utils/catalog.js'

const inputClass =
  'w-full min-w-0 bg-[#FCF9F2] border border-[#D8D1C5] px-3.5 py-2.5 text-[13px] text-[#1A1816] placeholder:text-[#969087] focus:border-[#1A1816] focus:outline-none transition-colors'

const labelClass =
  'block text-[10px] tracking-[0.18em] uppercase text-[#78736B] mb-1.5'

const createEmptyForm = (nextIndex = 1) => ({
  title: '',
  slug: '',
  indexLabel: `${String(nextIndex).padStart(2, '0')} / CAPSULE`,
  subtitle: '',
  featured: false,
  image: '',
})

const AddCategory = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin()
  const [form, setForm] = useState(() => createEmptyForm(1))
  const [editingSlug, setEditingSlug] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  const handleTitleChange = (val) => {
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: editingSlug ? prev.slug : toCategorySlug(val),
    }))
    if (feedback) setFeedback('')
    if (error) setError('')
  }

  const startEdit = (cat) => {
    setEditingSlug(cat.slug)
    setForm({
      title: cat.title || '',
      slug: cat.slug || '',
      indexLabel: cat.indexLabel || '01 / CAPSULE',
      subtitle: cat.subtitle || '',
      featured: Boolean(cat.featured),
      image: cat.image || '',
    })
    setImageFile(null)
    setFeedback('')
    setError('')
  }

  const cancelEdit = () => {
    setEditingSlug('')
    setForm(createEmptyForm(categories.length + 1))
    setImageFile(null)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFeedback('')
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        slug: toCategorySlug(form.slug || form.title),
        image: imageFile ? null : form.image.trim() || null,
        imageFile,
      }
      if (editingSlug) {
        const updated = await updateCategory(editingSlug, payload)
        setFeedback(`Category “${updated.title}” updated.`)
        setEditingSlug('')
      } else {
        const created = await addCategory(payload)
        setFeedback(`Category “${created.title}” created.`)
      }
      setForm(createEmptyForm(categories.length + 2))
      setImageFile(null)
    } catch (err) {
      setError(err?.message || 'Failed to save category')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (cat) => {
    setError('')
    setFeedback('')
    const result = await deleteCategory(cat.id)
    if (result?.meta?.requestStatus === 'rejected') {
      setError(result.payload || 'Failed to delete category')
      return
    }
    if (editingSlug === cat.slug) {
      cancelEdit()
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="TAXONOMY"
        title="Manage Categories"
        subtitle="Create, update, and organize storefront departments and curated capsules."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form */}
        <div className="lg:col-span-6 min-w-0">
          {error && (
            <div
              role="alert"
              className="mb-5 bg-[#EFE3DF] border border-[#C9A69C] px-4 py-3 text-[13px] text-[#6B2D22]"
            >
              {error}
            </div>
          )}

          {feedback && (
            <div className="mb-5 bg-[#F6F3EC] border border-[#1A1816]/35 px-4 py-3 flex items-center gap-2 text-[13px] text-[#1A1816]">
              <RiCheckLine size={16} aria-hidden="true" />
              <span>{feedback}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-[#F6F3EC] border border-[#EAE5DC] p-5 sm:p-7 space-y-5"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-[20px] font-normal text-[#1A1816]">
                {editingSlug ? 'Edit Category' : 'Add New Category'}
              </h2>
              {editingSlug && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="inline-flex items-center gap-1 text-[10px] tracking-[0.16em] uppercase text-[#6D6860] hover:text-[#1A1816] cursor-pointer"
                >
                  <RiCloseLine size={14} aria-hidden="true" />
                  <span>Cancel Edit</span>
                </button>
              )}
            </div>

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

            <AdminImageField
              id="cat-image-file"
              label="Category Editorial Image"
              file={imageFile}
              imageUrl={form.image}
              onFileChange={(nextFile) => {
                setImageFile(nextFile)
                if (feedback) setFeedback('')
              }}
              onUrlChange={(val) =>
                setForm((prev) => ({ ...prev, image: val }))
              }
              onError={setError}
            />

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
                disabled={submitting}
                className="px-7 py-3.5 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors disabled:opacity-60 cursor-pointer"
              >
                {submitting
                  ? editingSlug
                    ? 'SAVING...'
                    : 'CREATING...'
                  : editingSlug
                    ? 'UPDATE CATEGORY'
                    : 'CREATE CATEGORY'}
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
                <div className="flex items-start gap-3.5 min-w-0">
                  {cat.image && (
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-12 h-14 object-cover border border-[#E5DFD3] shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <p className="text-[9.5px] tracking-[0.18em] uppercase text-[#8A8379]">
                        {cat.indexLabel} · /{cat.slug}
                      </p>
                      <span className="text-[9.5px] tracking-[0.14em] uppercase px-2 py-0.5 bg-[#F3EFE6] text-[#5E5951]">
                        {cat.itemCount ?? 0}{' '}
                        {cat.itemCount === 1 ? 'Piece' : 'Pieces'}
                      </span>
                      {cat.featured && (
                        <span className="text-[9.5px] tracking-[0.14em] uppercase px-2 py-0.5 bg-[#151413] text-[#FCF9F2]">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="font-serif text-[18px] text-[#1A1816]">
                      {cat.title}
                    </p>
                    <p className="text-[12px] text-[#666058] mt-0.5">
                      {cat.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(cat)}
                    aria-label={`Edit ${cat.title}`}
                    className="p-1.5 text-[#5E5951] hover:text-[#1A1816] transition-colors cursor-pointer"
                  >
                    <RiEditLine size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat)}
                    aria-label={`Delete ${cat.title}`}
                    className="p-1.5 text-[#7A5448] hover:text-[#1A1816] transition-colors cursor-pointer"
                  >
                    <RiDeleteBinLine size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddCategory
