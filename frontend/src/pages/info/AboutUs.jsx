import { useAppSelector } from '../../App/hooks.js'
import { AboutHero, SustainabilityCharter } from '../../components/about'
import { PhilosophySection, VeloraCircleSection } from '../../components/home'
import {
  ATELIER_STANDARDS,
  PHILOSOPHY_DATA,
  SUSTAINABILITY_PILLARS,
} from '../../data/editorialData.js'

const AboutUs = () => {
  const philosophyImage = useAppSelector(
    (state) => state.catalog.siteSettings?.philosophyImage,
  )

  return (
    <>
      <AboutHero />
      <PhilosophySection image={philosophyImage ?? PHILOSOPHY_DATA.image} />
      <SustainabilityCharter
        pillars={SUSTAINABILITY_PILLARS}
        standards={ATELIER_STANDARDS}
      />
      <VeloraCircleSection />
    </>
  )
}

export default AboutUs
