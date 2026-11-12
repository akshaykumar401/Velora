import { useMemo } from 'react'
import { useAppSelector } from '../../App/hooks.js'
import {
  HeroSection,
  CuratedCategories,
  TrendingProducts,
  PhilosophySection,
  VeloraCircleSection,
} from '../../components/home'
import { HERO_DATA, PHILOSOPHY_DATA } from '../../data/editorialData.js'

const Home = () => {
  const { categories, products, siteSettings } = useAppSelector(
    (state) => state.catalog,
  )

  const featuredCategories = useMemo(() => {
    const featured = categories.filter((cat) => cat.featured)
    return featured.length > 0 ? featured : categories.slice(0, 3)
  }, [categories])
  const trendingProducts = useMemo(() => products.slice(0, 6), [products])

  const heroImage = siteSettings?.isHeroCustomized
    ? siteSettings.heroImage
    : siteSettings?.heroImage || HERO_DATA.image
  const philosophyImage = siteSettings?.isHeroCustomized
    ? siteSettings.philosophyImage
    : siteSettings?.philosophyImage || PHILOSOPHY_DATA.image

  return (
    <>
      <HeroSection
        image={heroImage}
        eyebrow={siteSettings?.heroEyebrow || HERO_DATA.eyebrow}
        title={siteSettings?.heroTitle || HERO_DATA.title}
        subtitle={siteSettings?.heroSubtitle || HERO_DATA.subtitle}
      />
      <CuratedCategories categories={featuredCategories} />
      <TrendingProducts products={trendingProducts} />
      <PhilosophySection image={philosophyImage} />
      <VeloraCircleSection />
    </>
  )
}

export default Home
