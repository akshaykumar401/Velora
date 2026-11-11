import { AboutHero, SustainabilityCharter } from '../../components/about'
import { PhilosophySection, VeloraCircleSection } from '../../components/home'
import {
  ATELIER_STANDARDS,
  SUSTAINABILITY_PILLARS,
} from '../../data/editorialData.js'
import { PHILOSOPHY_DATA } from '../../data/homeData.js'

const AboutUs = () => {
  return (
    <>
      <AboutHero />
      <PhilosophySection image={PHILOSOPHY_DATA.image} />
      <SustainabilityCharter
        pillars={SUSTAINABILITY_PILLARS}
        standards={ATELIER_STANDARDS}
      />
      <VeloraCircleSection />
    </>
  )
}

export default AboutUs
