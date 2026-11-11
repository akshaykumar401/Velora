import logoMark from '../../assets/images/velora-logo-mark.png'

const BrandLogo = ({ showTagline = false, size = 'md' }) => {
  const badgeClasses =
    size === 'lg'
      ? 'w-11 h-11 rounded-xl p-1.5'
      : 'w-7 h-7 sm:w-8 sm:h-8 rounded-lg p-1'

  const textClasses =
    size === 'lg'
      ? 'text-[20px] sm:text-[22px] tracking-[0.22em] sm:tracking-[0.28em]'
      : 'text-[15px] sm:text-[18px] tracking-[0.18em] sm:tracking-[0.26em]'

  return (
    <span className="inline-flex items-center gap-2 sm:gap-3 shrink-0 group min-w-0">
      <span
        className={`${badgeClasses} bg-[#F1F2F7] border border-[#E6E7EE] flex items-center justify-center transition-colors group-hover:bg-[#E9EBF3] overflow-hidden shrink-0`}
      >
        <img
          src={logoMark}
          alt="Velora brand emblem"
          className="w-full h-full object-contain"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-serif ${textClasses} font-semibold uppercase text-[#1A1816]`}
        >
          VELORA
        </span>
        {showTagline && (
          <span className="text-[9px] tracking-[0.24em] uppercase text-[#6D6860] mt-1">
            Curated Goods
          </span>
        )}
      </span>
    </span>
  )
}

export default BrandLogo
