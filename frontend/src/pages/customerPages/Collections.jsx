import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../App/hooks.js'
import { CollectionShowcaseCard } from '../../components/collections'
import { productMatchesCategory } from '../../utils/catalog.js'

const Collections = () => {
  const { categories, products } = useAppSelector((state) => state.catalog)

  const collections = useMemo(
    () =>
      categories
        .map((cat) => ({
          id: cat.id,
          season: cat.indexLabel,
          title: cat.title,
          description: cat.subtitle,
          ctaTo: `/shop?category=${cat.slug}`,
          coverImage: cat.image,
          placeholderBg: cat.placeholderBg,
          products: products
            .filter((p) => productMatchesCategory(p, cat))
            .slice(0, 3),
        }))
        .filter((col) => col.products.length > 0 || col.title),
    [categories, products],
  )

  return (
    <>
      <section className="pt-12 pb-10 sm:pt-16 sm:pb-12 bg-[#FCF9F2] border-b border-[#EAE5DC]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="max-w-[680px]">
            <p className="text-[10px] tracking-[0.26em] uppercase text-[#8A8379] mb-2">
              SEASONAL ARCHIVE
            </p>
            <h1 className="font-serif text-[34px] sm:text-[46px] font-normal text-[#1A1816] leading-[1.1] mb-4">
              Curated Collections
            </h1>
            <p className="text-[13px] sm:text-[14px] leading-[1.7] text-[#666058]">
              Explore cohesive seasonal capsules uniting sculptural wool coats,
              cashmere essentials, and vegetable-tanned leather craft.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#FCF9F2]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
          {collections.length === 0 ? (
            <div className="py-20 text-center max-w-[480px] mx-auto">
              <p className="font-serif text-[26px] text-[#1A1816] mb-3">
                No collections published yet
              </p>
              <p className="text-[13px] text-[#6D6860] mb-6">
                Add categories and products in the Admin Console to populate your
                seasonal capsules.
              </p>
              <Link
                to="/shop"
                className="inline-block px-7 py-3 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase"
              >
                EXPLORE SHOP
              </Link>
            </div>
          ) : (
            collections.map((collection, idx) => (
              <CollectionShowcaseCard
                key={collection.id}
                collection={collection}
                reversed={idx % 2 === 1}
              />
            ))
          )}
        </div>
      </section>
    </>
  )
}

export default Collections
