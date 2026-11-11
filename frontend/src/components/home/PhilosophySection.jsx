import { Link } from 'react-router-dom'
import { RiArrowRightLine } from '@remixicon/react'
import logoMark from '../../assets/images/velora-logo-mark.png'

const PhilosophySection = ({ image }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#FCF9F2]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Atelier Photography */}
          <div className="lg:col-span-6">
            <div className="aspect-[4/3.4] overflow-hidden bg-[#EAE5DC]">
              {image ? (
                <img
                  src={image}
                  alt="Velora artisan tailor stitching wool cloth in atelier"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#DFD5C6] via-[#C8BBA8] to-[#988A78] flex flex-col items-center justify-center p-8 text-center">
                  <img
                    src={logoMark}
                    alt=""
                    aria-hidden="true"
                    className="w-12 h-12 object-contain opacity-60 mb-3"
                  />
                  <span className="text-[10px] tracking-[0.26em] uppercase text-[#3F3A33]">
                    Velora Atelier · European Mills
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Editorial Copy */}
          <div className="lg:col-span-6 lg:pl-4 max-w-[520px]">
            <p className="text-[10px] tracking-[0.24em] uppercase text-[#8A8379] mb-2.5">
              OUR PHILOSOPHY
            </p>
            <h2 className="font-serif text-[28px] sm:text-[34px] font-normal text-[#1A1816] leading-[1.18] mb-6">
              Sustainable Luxury &amp; Artisanal Craftsmanship
            </h2>

            <p className="text-[13px] leading-[1.75] text-[#666058] mb-4">
              At Velora, we believe true luxury lies in the integrity of creation.
              Every garment is responsibly sourced from storied family-owned mills
              across Europe and crafted with uncompromising attention to detail.
            </p>
            <p className="text-[13px] leading-[1.75] text-[#666058] mb-8">
              We design with longevity in mind, bypassing ephemeral trends in favor
              of enduring silhouettes that age with grace and distinction.
            </p>

            <Link
              to="/about"
              className="inline-flex items-center gap-2.5 text-[10.5px] font-medium tracking-[0.18em] uppercase text-[#1A1816] border-b border-[#1A1816]/40 pb-1.5 hover:border-[#1A1816] transition-colors"
            >
              <span>READ OUR SUSTAINABILITY CHARTER</span>
              <RiArrowRightLine size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PhilosophySection
