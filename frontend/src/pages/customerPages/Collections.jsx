import { CollectionShowcaseCard } from '../../components/collections'
import { COLLECTIONS } from '../../data/editorialData.js'

const Collections = () => {
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
          {COLLECTIONS.map((collection, idx) => (
            <CollectionShowcaseCard
              key={collection.id}
              collection={collection}
              reversed={idx % 2 === 1}
            />
          ))}
        </div>
      </section>
    </>
  )
}

export default Collections

