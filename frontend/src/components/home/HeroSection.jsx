import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RiArrowDownSLine } from '@remixicon/react'

const HeroSection = ({
  image,
  eyebrow = 'DISCOVER THE AUTUMN / WINTER COLLECTION',
  title = 'Timeless Elegance, Modern Craft',
  subtitle = 'Immaculate tailoring, noble materials, and effortless silhouettes designed for the discerning wardrobe.',
}) => {
  const [failedImageSrc, setFailedImageSrc] = useState('')
  const showImage = Boolean(image) && failedImageSrc !== image

  return (
    <section className="relative overflow-hidden bg-[#EAE3D7] min-h-[540px] sm:min-h-[620px] lg:min-h-[700px] flex items-center justify-center">
      {/* Background Editorial Photography */}
      {showImage ? (
        <img
          src={image}
          alt="Velora Autumn Winter editorial look"
          onError={() => setFailedImageSrc(image)}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      ) : (
        /* Sunlit limestone & plaster architectural backdrop when image is absent */
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(125deg,#F6F1E8_0%,#DFD6C7_38%,#C7BBA8_62%,#EDE7DC_100%)]"
        >
          <div className="absolute inset-y-0 left-0 w-1/2 bg-[linear-gradient(110deg,rgba(255,252,245,0.75)_0%,rgba(255,252,245,0.1)_65%,transparent_100%)]" />
          <div className="absolute inset-y-0 right-1/4 w-px bg-[#1A1816]/8" />
        </div>
      )}

      {/* Atmospheric Edge & Bottom Ivory Fade matching reference */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#FCF9F2]/20 via-transparent to-[#FCF9F2]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#FCF9F2]/55 via-[#FCF9F2]/15 to-[#FCF9F2]/55"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(252,249,242,0.52)_0%,rgba(252,249,242,0.12)_55%,rgba(252,249,242,0.45)_100%)]"
      />

      {/* Center Content */}
      <div className="relative z-10 w-full max-w-[680px] mx-auto px-4 sm:px-8 text-center pt-10 pb-16">
        <p className="text-[9.5px] sm:text-[11px] font-medium tracking-[0.2em] sm:tracking-[0.28em] uppercase text-[#403B34] mb-3.5">
          {eyebrow}
        </p>

        <h1 className="font-serif text-[32px] sm:text-[52px] lg:text-[62px] font-normal leading-[1.06] tracking-[-0.01em] text-[#1A1816] mb-4">
          {title}
        </h1>

        <p className="text-[13px] sm:text-[14px] leading-[1.65] text-[#3F3A33] max-w-[460px] mx-auto mb-8">
          {subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/shop"
            className="px-7 py-3.5 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.22em] uppercase hover:bg-[#2B2825] transition-colors"
          >
            SHOP COLLECTION
          </Link>
          <a
            href="#categories"
            className="px-7 py-3.5 border border-[#1A1816]/40 bg-[#FCF9F2]/45 backdrop-blur-[2px] text-[#1A1816] text-[10.5px] font-medium tracking-[0.22em] uppercase hover:bg-[#1A1816] hover:text-[#FCF9F2] transition-colors"
          >
            EXPLORE MORE
          </a>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <a
        href="#categories"
        aria-label="Scroll to categories"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-0.5 text-[#5E584F] hover:text-[#1A1816] transition-colors"
      >
        <span className="text-[9px] font-medium tracking-[0.28em] uppercase">
          SCROLL
        </span>
        <RiArrowDownSLine size={15} aria-hidden="true" />
      </a>
    </section>
  )
}

export default HeroSection
