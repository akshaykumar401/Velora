const SustainabilityCharter = ({ pillars = [], standards = [] }) => {
  return (
    <>
      <section className="py-14 sm:py-20 bg-[#FCF9F2]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="max-w-[540px] mb-10 sm:mb-12">
            <p className="text-[10px] tracking-[0.24em] uppercase text-[#8A8379] mb-2">
              SUSTAINABILITY CHARTER
            </p>
            <h2 className="font-serif text-[28px] sm:text-[34px] font-normal text-[#1A1816] leading-tight">
              Three Pillars of Responsible Creation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {pillars.map((pillar) => (
              <div
                key={pillar.index}
                className="border-t border-[#DFD9CE] pt-6"
              >
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#8A8379] mb-2">
                  {pillar.index}
                </p>
                <h3 className="font-serif text-[22px] font-normal text-[#1A1816] mb-3">
                  {pillar.title}
                </h3>
                <p className="text-[13px] leading-[1.75] text-[#666058]">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#F6F3EC] border-t border-[#EAE5DC]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {standards.map((item) => (
              <div key={item.label}>
                <p className="font-serif text-[30px] sm:text-[36px] text-[#1A1816] leading-none mb-2">
                  {item.value}
                </p>
                <p className="text-[11.5px] tracking-[0.04em] text-[#6D6860]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default SustainabilityCharter

