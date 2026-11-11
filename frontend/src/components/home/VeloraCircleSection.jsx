import { useState } from 'react'

const VeloraCircleSection = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <section className="pb-16 sm:pb-24 pt-4 bg-[#FCF9F2]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#F4ECE1] via-[#EFEAE1] to-[#EAE4DA] px-6 sm:px-12 py-14 sm:py-20 text-center">
          {/* Subtle warm radial ambient accents */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#E8D8C6]/45 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#E4D5C3]/40 blur-3xl"
          />

          <div className="relative max-w-[520px] mx-auto">
            <p className="text-[10px] tracking-[0.26em] uppercase text-[#8A8379] mb-2.5">
              PRIVATE ACCESS
            </p>
            <h2 className="font-serif text-[28px] sm:text-[34px] font-normal text-[#1A1816] mb-3">
              Join the Velora Circle
            </h2>
            <p className="text-[12.5px] sm:text-[13px] leading-[1.7] text-[#6E685F] max-w-[440px] mx-auto mb-8">
              Receive private invitations to collection previews, exclusive lookbooks,
              and intimate atelier-house launches.
            </p>

            <form
              onSubmit={handleSubmit}
              className="max-w-[450px] mx-auto flex flex-col sm:flex-row items-stretch gap-2.5"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (subscribed) setSubscribed(false)
                }}
                placeholder="Enter your email address"
                aria-label="Email address for private access"
                className="flex-1 bg-[#FCF9F2] px-4 py-3 text-[12.5px] text-[#1A1816] placeholder:text-[#969087] border border-transparent focus:border-[#C8C0B4] focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="px-7 py-3 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors shrink-0 cursor-pointer"
              >
                SUBSCRIBE
              </button>
            </form>

            {subscribed && (
              <p className="text-[12px] text-[#4E4942] mt-3.5">
                Welcome to the Velora Circle. Your private invitation awaits.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default VeloraCircleSection

