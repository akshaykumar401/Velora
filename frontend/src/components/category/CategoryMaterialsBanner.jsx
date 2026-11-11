import { Link } from 'react-router-dom'
import { RiArrowRightLine } from '@remixicon/react'

const CategoryMaterialsBanner = ({ materials = [] }) => {
  return (
    <section className="py-16 sm:py-20 bg-[#F6F3EC] border-t border-[#EAE5DC]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[10px] tracking-[0.24em] uppercase text-[#8A8379] mb-1.5">
              NOBLE TEXTILES
            </p>
            <h2 className="font-serif text-[28px] sm:text-[32px] font-normal text-[#1A1816] leading-tight">
              Signature Materials
            </h2>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-[10.5px] font-medium tracking-[0.18em] uppercase text-[#4B463F] hover:text-[#1A1816] transition-colors self-start sm:self-auto"
          >
            <span>SHOP ALL MATERIALS</span>
            <RiArrowRightLine size={14} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {materials.map((item) => (
            <div key={item.index} className="border-t border-[#D8D1C6] pt-5">
              <p className="text-[10px] tracking-[0.22em] uppercase text-[#8A8379] mb-2">
                {item.index}
              </p>
              <h3 className="font-serif text-[20px] font-normal text-[#1A1816] mb-2">
                {item.title}
              </h3>
              <p className="text-[12.5px] leading-[1.7] text-[#666058]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryMaterialsBanner

