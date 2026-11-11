import { Link, useParams } from 'react-router-dom'
import { RiArrowRightSLine } from '@remixicon/react'
import {
  ProductGallery,
  ProductInfo,
  RelatedProducts,
} from '../../components/product'
import { getProductById, getRelatedProducts } from '../../data/catalogData.js'

const ProductDetail = () => {
  const { id } = useParams()
  const product = getProductById(id)

  if (!product) {
    return (
      <section className="py-24 sm:py-32 bg-[#FCF9F2]">
        <div className="max-w-[520px] mx-auto px-5 text-center">
          <p className="text-[10px] tracking-[0.24em] uppercase text-[#8A8379] mb-2">
            ARCHIVE LOOKUP
          </p>
          <h1 className="font-serif text-[32px] text-[#1A1816] mb-3">
            Piece not found
          </h1>
          <p className="text-[13px] leading-[1.7] text-[#6D6860] mb-8">
            The garment or accessory you requested is no longer in this season’s
            curated showcase.
          </p>
          <Link
            to="/shop"
            className="inline-block px-7 py-3.5 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors"
          >
            RETURN TO COLLECTION
          </Link>
        </div>
      </section>
    )
  }

  const relatedProducts = getRelatedProducts(product, 4)

  return (
    <>
      <section className="py-10 sm:py-14 lg:py-16 bg-[#FCF9F2]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase text-[#8A8379] mb-8 min-w-0"
          >
            <Link to="/" className="hover:text-[#1A1816] transition-colors">
              Home
            </Link>
            <RiArrowRightSLine size={14} aria-hidden="true" className="shrink-0" />
            <Link to="/shop" className="hover:text-[#1A1816] transition-colors">
              Shop
            </Link>
            <RiArrowRightSLine size={14} aria-hidden="true" className="shrink-0" />
            <span className="text-[#1A1816] truncate max-w-full">{product.name}</span>
          </nav>

          {/* 2-Column Product Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-6 min-w-0">
              <ProductGallery product={product} />
            </div>
            <div className="lg:col-span-6 min-w-0">
              <ProductInfo key={product.id} product={product} />
            </div>
          </div>
        </div>
      </section>

      <RelatedProducts products={relatedProducts} />
    </>
  )
}

export default ProductDetail
