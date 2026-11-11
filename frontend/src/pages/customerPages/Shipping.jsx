import { CarePageHeader, ShippingPolicies } from '../../components/care'
import { RETURN_STEPS, SHIPPING_METHODS } from '../../data/editorialData.js'

const Shipping = () => {
  return (
    <>
      <CarePageHeader
        title="Shipping & Returns"
        subtitle="Complimentary carbon-neutral courier delivery and effortless 30-day returns across all orders."
      />
      <ShippingPolicies
        methods={SHIPPING_METHODS}
        returnSteps={RETURN_STEPS}
      />
    </>
  )
}

export default Shipping

