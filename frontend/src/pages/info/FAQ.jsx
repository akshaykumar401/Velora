import { CarePageHeader, FaqAccordion } from '../../components/care'
import { FAQ_CATEGORIES, FAQ_ITEMS } from '../../data/editorialData.js'

const FAQ = () => {
  return (
    <>
      <CarePageHeader
        title="Frequently Asked Questions"
        subtitle="Answers regarding garment sizing, courier shipping, returns, and long-term textile care."
      />
      <FaqAccordion categories={FAQ_CATEGORIES} items={FAQ_ITEMS} />
    </>
  )
}

export default FAQ
