import { useEffect, useMemo, useState } from 'react'
import { RiCheckLine, RiRefreshLine } from '@remixicon/react'
import { AdminImageField, AdminPageHeader } from '../../components/admin'
import { HERO_DATA, PHILOSOPHY_DATA } from '../../data/editorialData.js'
import { useAdmin } from '../../features/admin/adminContext.js'

const inputClass =
  'w-full min-w-0 bg-[#FCF9F2] border border-[#D8D1C5] px-3.5 py-2.5 text-[13px] text-[#1A1816] placeholder:text-[#969087] focus:border-[#1A1816] focus:outline-none transition-colors'

const labelClass =
  'block text-[10px] tracking-[0.18em] uppercase text-[#78736B] mb-1.5'

const buildInitialForm = (siteSettings) => {
  const initialHeroImg = siteSettings?.isHeroCustomized
    ? siteSettings.heroImage || ''
    : siteSettings?.heroImage || HERO_DATA.image || ''

  const initialPhilImg = siteSettings?.isHeroCustomized
    ? siteSettings.philosophyImage || ''
    : siteSettings?.philosophyImage || PHILOSOPHY_DATA.image || ''

  return {
    heroImage: initialHeroImg,
    heroEyebrow: siteSettings?.heroEyebrow || HERO_DATA.eyebrow,
    heroTitle: siteSettings?.heroTitle || HERO_DATA.title,
    heroSubtitle: siteSettings?.heroSubtitle || HERO_DATA.subtitle,
    philosophyImage: initialPhilImg,
  }
}

const ManageStorefront = () => {
  const { siteSettings, updateSiteSettings } = useAdmin()
  const baseForm = useMemo(() => buildInitialForm(siteSettings), [siteSettings])
  const [draft, setDraft] = useState(null)
  const [heroFile, setHeroFile] = useState(null)
  const [philosophyFile, setPhilosophyFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const form = draft ?? baseForm

  const heroObjectUrl = useMemo(
    () => (heroFile ? URL.createObjectURL(heroFile) : ''),
    [heroFile],
  )

  useEffect(() => {
    return () => {
      if (heroObjectUrl) {
        URL.revokeObjectURL(heroObjectUrl)
      }
    }
  }, [heroObjectUrl])

  const previewHeroSrc = heroObjectUrl || form.heroImage?.trim() || ''

  const handleFieldChange = (field, value) => {
    setDraft((prev) => ({ ...(prev ?? baseForm), [field]: value }))
    if (saved) setSaved(false)
    if (error) setError('')
  }

  const handleResetHeroImage = () => {
    setHeroFile(null)
    handleFieldChange('heroImage', '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError('')

    try {
      await updateSiteSettings({
        heroImage: heroFile ? null : form.heroImage?.trim() || null,
        philosophyImage: philosophyFile
          ? null
          : form.philosophyImage?.trim() || null,
        heroEyebrow: form.heroEyebrow.trim(),
        heroTitle: form.heroTitle.trim(),
        heroSubtitle: form.heroSubtitle.trim(),
        heroImageFile: heroFile,
        philosophyImageFile: philosophyFile,
      })
      setDraft(null)
      setHeroFile(null)
      setPhilosophyFile(null)
      setSaved(true)
    } catch (err) {
      setError(err?.message || 'Failed to update storefront hero settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="STOREFRONT VISUALS"
        title="Hero & Editorial Media"
        subtitle="Upload a new Hero banner image, adjust headline copy, or manage editorial photography shown on the home page."
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-7 min-w-0">
          {error && (
            <div
              role="alert"
              className="mb-5 bg-[#EFE3DF] border border-[#C9A69C] px-4 py-3 text-[13px] text-[#6B2D22]"
            >
              {error}
            </div>
          )}

          {saved && (
            <div className="mb-5 bg-[#F6F3EC] border border-[#1A1816]/35 px-4 py-3 flex items-center gap-2 text-[13px] text-[#1A1816]">
              <RiCheckLine size={16} aria-hidden="true" />
              <span>Storefront hero image and copy updated live.</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-[#F6F3EC] border border-[#EAE5DC] p-5 sm:p-8 space-y-6"
          >
            <div className="space-y-3">
              <AdminImageField
                id="storefront-hero-file"
                label="Hero Banner Image"
                file={heroFile}
                imageUrl={form.heroImage}
                onFileChange={(file) => {
                  setHeroFile(file)
                  if (saved) setSaved(false)
                }}
                onUrlChange={(val) => handleFieldChange('heroImage', val)}
                onError={setError}
              />

              {(heroFile || form.heroImage) && (
                <button
                  type="button"
                  onClick={handleResetHeroImage}
                  className="inline-flex items-center gap-1.5 text-[10.5px] tracking-[0.14em] uppercase text-[#6D6860] hover:text-[#1A1816] cursor-pointer"
                >
                  <RiRefreshLine size={13} aria-hidden="true" />
                  <span>Use Default Ivory Backdrop</span>
                </button>
              )}
            </div>

            <div>
              <label htmlFor="hero-eyebrow" className={labelClass}>
                Hero Eyebrow
              </label>
              <input
                id="hero-eyebrow"
                type="text"
                required
                value={form.heroEyebrow}
                onChange={(e) =>
                  handleFieldChange('heroEyebrow', e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="hero-title" className={labelClass}>
                Hero Headline
              </label>
              <input
                id="hero-title"
                type="text"
                required
                value={form.heroTitle}
                onChange={(e) => handleFieldChange('heroTitle', e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="hero-subtitle" className={labelClass}>
                Hero Subtitle
              </label>
              <textarea
                id="hero-subtitle"
                rows={3}
                required
                value={form.heroSubtitle}
                onChange={(e) =>
                  handleFieldChange('heroSubtitle', e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div className="pt-2 border-t border-[#E5DFD3]">
              <AdminImageField
                id="storefront-philosophy-file"
                label="Atelier Philosophy Section Image (Optional)"
                file={philosophyFile}
                imageUrl={form.philosophyImage}
                onFileChange={(file) => {
                  setPhilosophyFile(file)
                  if (saved) setSaved(false)
                }}
                onUrlChange={(val) =>
                  handleFieldChange('philosophyImage', val)
                }
                onError={setError}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-7 py-3.5 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors disabled:opacity-60 cursor-pointer"
            >
              {saving ? 'SAVING HERO...' : 'SAVE HERO SETTINGS'}
            </button>
          </form>
        </div>

        {/* Live Hero Banner Preview */}
        <div className="xl:col-span-5 min-w-0 space-y-3">
          <p className={labelClass}>Live Hero Preview</p>
          <div className="relative overflow-hidden border border-[#E5DFD3] bg-[#EAE3D7] min-h-[300px] sm:min-h-[340px] flex items-center justify-center p-6 text-center">
            {previewHeroSrc ? (
              <img
                src={previewHeroSrc}
                alt="Hero preview"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            ) : (
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(125deg,#F6F1E8_0%,#DFD6C7_38%,#C7BBA8_62%,#EDE7DC_100%)]"
              />
            )}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-[#FCF9F2]/30 via-[#FCF9F2]/25 to-[#FCF9F2]/85"
            />

            <div className="relative z-10 max-w-[380px] mx-auto">
              <p className="text-[9px] font-medium tracking-[0.22em] uppercase text-[#403B34] mb-2">
                {form.heroEyebrow}
              </p>
              <h2 className="font-serif text-[26px] sm:text-[30px] font-normal leading-tight text-[#1A1816] mb-2.5">
                {form.heroTitle}
              </h2>
              <p className="text-[11.5px] leading-[1.6] text-[#3F3A33]">
                {form.heroSubtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageStorefront

