import {
  HeroSection,
  CuratedCategories,
  TrendingProducts,
  PhilosophySection,
  VeloraCircleSection,
} from '../../components/home'
import {
  HERO_DATA,
  CURATED_CATEGORIES,
  TRENDING_PRODUCTS,
  PHILOSOPHY_DATA,
} from '../../data/homeData.js'

const Home = () => {
  return (
    <>
      <HeroSection
        image={HERO_DATA.image}
        eyebrow={HERO_DATA.eyebrow}
        title={HERO_DATA.title}
        subtitle={HERO_DATA.subtitle}
      />
      <CuratedCategories categories={CURATED_CATEGORIES} />
      <TrendingProducts products={TRENDING_PRODUCTS} />
      <PhilosophySection image={PHILOSOPHY_DATA.image} />
      <VeloraCircleSection />
    </>
  )
}

export default Home
