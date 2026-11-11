import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <section className="py-24 sm:py-32 bg-[#FCF9F2]">
      <div className="max-w-[520px] mx-auto px-4 text-center">
        <p className="text-[10px] tracking-[0.26em] uppercase text-[#8A8379] mb-2">
          404 · PAGE NOT FOUND
        </p>
        <h1 className="font-serif text-[34px] sm:text-[42px] font-normal text-[#1A1816] mb-3">
          This page could not be found
        </h1>
        <p className="text-[13px] leading-[1.7] text-[#6D6860] mb-8">
          The route you requested does not exist in the Velora archive. Return
          to the homepage or explore our seasonal collection.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="px-7 py-3.5 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors"
          >
            RETURN HOME
          </Link>
          <Link
            to="/shop"
            className="px-7 py-3.5 border border-[#CFC9BE] text-[#1A1816] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:border-[#1A1816] transition-colors"
          >
            BROWSE SHOP
          </Link>
        </div>
      </div>
    </section>
  )
}

export default NotFound

