import { useEffect, useMemo, useRef } from 'react'
import { RiCloseLine, RiImageAddLine } from '@remixicon/react'

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

const labelClass =
  'block text-[10px] tracking-[0.18em] uppercase text-[#78736B] mb-1.5'

const inputClass =
  'w-full min-w-0 bg-[#FCF9F2] border border-[#D8D1C5] px-3.5 py-2.5 text-[13px] text-[#1A1816] placeholder:text-[#969087] focus:border-[#1A1816] focus:outline-none transition-colors'

const formatFileSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const AdminImageField = ({
  id = 'admin-image-upload',
  label = 'Product Photography',
  file,
  imageUrl,
  onFileChange,
  onUrlChange,
  onError,
}) => {
  const inputRef = useRef(null)
  const objectUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : ''),
    [file],
  )

  useEffect(() => {
    if (!file && inputRef.current) {
      inputRef.current.value = ''
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [file, objectUrl])

  const previewSrc = objectUrl || imageUrl?.trim() || ''

  const handleSelectedFile = (nextFile) => {
    if (!nextFile) return
    if (!nextFile.type?.startsWith('image/')) {
      onError?.('Please choose an image file (JPG, PNG, WEBP, or AVIF).')
      if (inputRef.current) inputRef.current.value = ''
      return
    }
    if (nextFile.size > MAX_FILE_SIZE_BYTES) {
      onError?.('Image size must be 5 MB or less.')
      if (inputRef.current) inputRef.current.value = ''
      return
    }
    onError?.('')
    onFileChange(nextFile)
  }

  const handleClearFile = () => {
    onFileChange(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>

      <div className="bg-[#FCF9F2] border border-[#D8D1C5] p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        {previewSrc ? (
          <div className="relative w-20 h-24 shrink-0 bg-[#EFE9DE] border border-[#E5DFD3] overflow-hidden">
            <img
              src={previewSrc}
              alt="Selected preview"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-20 h-24 shrink-0 bg-[#F3EFE6] border border-dashed border-[#CFC8BB] flex items-center justify-center text-[#8A8379]">
            <RiImageAddLine size={22} aria-hidden="true" />
          </div>
        )}

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <label
              htmlFor={id}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1A1816] text-[#FCF9F2] text-[10px] font-medium tracking-[0.18em] uppercase hover:bg-[#322E2A] transition-colors cursor-pointer"
            >
              <RiImageAddLine size={14} aria-hidden="true" />
              <span>{file ? 'Replace Image' : 'Upload Image'}</span>
            </label>

            {file && (
              <button
                type="button"
                onClick={handleClearFile}
                className="inline-flex items-center gap-1 px-2.5 py-2 border border-[#D8D1C5] text-[10px] tracking-[0.14em] uppercase text-[#5F5950] hover:border-[#1A1816] hover:text-[#1A1816] transition-colors cursor-pointer"
              >
                <RiCloseLine size={13} aria-hidden="true" />
                <span>Remove</span>
              </button>
            )}
          </div>

          <input
            ref={inputRef}
            id={id}
            type="file"
            accept="image/*"
            onChange={(e) => handleSelectedFile(e.target.files?.[0])}
            className="sr-only"
          />

          <p className="text-[11.5px] text-[#6D675F] truncate">
            {file
              ? `${file.name} (${formatFileSize(file.size)})`
              : 'JPG, PNG, WEBP, or AVIF up to 5 MB.'}
          </p>
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-url`} className={labelClass}>
          Or Image URL (Optional)
        </label>
        <input
          id={`${id}-url`}
          type="url"
          value={imageUrl}
          disabled={Boolean(file)}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder={
            file
              ? 'Clear uploaded image above to enter an external URL'
              : 'https://...'
          }
          className={`${inputClass} disabled:opacity-60`}
        />
      </div>
    </div>
  )
}

export default AdminImageField
