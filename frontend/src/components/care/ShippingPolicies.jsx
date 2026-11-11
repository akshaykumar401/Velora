const ShippingPolicies = ({ methods = [], returnSteps = [] }) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#FCF9F2]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 space-y-16">
        {/* Delivery Methods */}
        <div>
          <p className="text-[10px] tracking-[0.24em] uppercase text-[#8A8379] mb-2">
            GLOBAL DELIVERY
          </p>
          <h2 className="font-serif text-[28px] sm:text-[32px] font-normal text-[#1A1816] mb-8">
            Dispatch &amp; Courier Options
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {methods.map((method) => (
              <div
                key={method.title}
                className="bg-[#F6F3EC] border border-[#EAE5DC] p-6 flex flex-col justify-between gap-4"
              >
                <div>
                  <p className="text-[10px] tracking-[0.18em] uppercase text-[#8A8379] mb-2">
                    {method.timing}
                  </p>
                  <h3 className="font-serif text-[22px] font-normal text-[#1A1816] mb-2">
                    {method.title}
                  </h3>
                  <p className="text-[13px] leading-[1.7] text-[#666058]">
                    {method.notes}
                  </p>
                </div>

                <p className="text-[12px] font-medium text-[#1A1816] pt-4 border-t border-[#E5DFD3]">
                  {method.cost}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Returns Process */}
        <div className="border-t border-[#EAE5DC] pt-14">
          <p className="text-[10px] tracking-[0.24em] uppercase text-[#8A8379] mb-2">
            COMPLIMENTARY RETURNS
          </p>
          <h2 className="font-serif text-[28px] sm:text-[32px] font-normal text-[#1A1816] mb-8">
            30-Day Atelier Return Process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {returnSteps.map((item) => (
              <div key={item.step} className="border-t border-[#DFD9CE] pt-5">
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#8A8379] mb-2">
                  STEP {item.step}
                </p>
                <h3 className="font-serif text-[21px] font-normal text-[#1A1816] mb-2">
                  {item.title}
                </h3>
                <p className="text-[13px] leading-[1.7] text-[#666058]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ShippingPolicies

