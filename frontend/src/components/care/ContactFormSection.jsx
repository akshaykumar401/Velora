import { useState } from 'react'
import { RiCheckLine, RiMailLine, RiMapPinLine, RiTimeLine } from '@remixicon/react'
import { catalogApi } from '../../services/catalogApi.js'

const inputClass =
  'w-full min-w-0 bg-[#FCF9F2] border border-[#D8D1C5] px-3.5 py-2.5 text-[13px] text-[#1A1816] placeholder:text-[#969087] focus:border-[#1A1816] focus:outline-none transition-colors'

const labelClass =
  'block text-[10px] tracking-[0.18em] uppercase text-[#78736B] mb-1.5'

const ContactFormSection = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: 'Sizing & Garment Consultation',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (sending) return

    setSending(true)
    setSubmitError('')
    setSubmitted(false)
    try {
      await catalogApi.submitContactInquiry(form)
      setSubmitted(true)
      setForm({
        name: '',
        email: '',
        topic: 'Sizing & Garment Consultation',
        message: '',
      })
    } catch (err) {
      setSubmitError(
        err?.message || 'Unable to send inquiry right now. Please try again.',
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#FCF9F2]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Concierge Details */}
          <div className="lg:col-span-5 space-y-6 min-w-0">
            <h2 className="font-serif text-[26px] font-normal text-[#1A1816]">
              Atelier Client Concierge
            </h2>
            <p className="text-[13px] leading-[1.75] text-[#666058]">
              Our dedicated garment specialists assist with sizing advice,
              private showroom appointments, and bespoke alterations.
            </p>

            <div className="space-y-4 pt-2 border-t border-[#EAE5DC] text-[13px] text-[#5E5951]">
              <div className="flex items-start gap-3">
                <RiMailLine size={16} className="text-[#1A1816] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[10px] tracking-[0.16em] uppercase text-[#8A8379]">
                    Email
                  </p>
                  <p className="text-[#1A1816]">concierge@velora.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RiTimeLine size={16} className="text-[#1A1816] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[10px] tracking-[0.16em] uppercase text-[#8A8379]">
                    Concierge Hours
                  </p>
                  <p className="text-[#1A1816]">Monday – Saturday, 9:00 – 19:00 EST</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RiMapPinLine size={16} className="text-[#1A1816] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[10px] tracking-[0.16em] uppercase text-[#8A8379]">
                    Flagship Ateliers
                  </p>
                  <p className="text-[#1A1816]">Mercer Street, New York · Via Solferino, Milan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7 min-w-0">
            <form
              onSubmit={handleSubmit}
              className="bg-[#F6F3EC] border border-[#EAE5DC] p-6 sm:p-8 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className={labelClass}>
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                      if (submitted) setSubmitted(false)
                    }}
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                      if (submitted) setSubmitted(false)
                    }}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-topic" className={labelClass}>
                  Inquiry Topic
                </label>
                <select
                  id="contact-topic"
                  value={form.topic}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, topic: e.target.value }))
                  }
                  className={inputClass}
                >
                  <option>Sizing &amp; Garment Consultation</option>
                  <option>Existing Order Assistance</option>
                  <option>Private Showroom Appointment</option>
                  <option>Press &amp; Sustainability</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className={labelClass}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, message: e.target.value }))
                    if (submitted) setSubmitted(false)
                  }}
                  placeholder="How may our atelier assist you?"
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {sending ? (
                  <span>SENDING INQUIRY...</span>
                ) : submitted ? (
                  <>
                    <RiCheckLine size={15} aria-hidden="true" />
                    <span>MESSAGE SENT</span>
                  </>
                ) : (
                  <span>SEND INQUIRY</span>
                )}
              </button>

              {submitError && (
                <p role="alert" className="text-[12.5px] text-[#8E2A20]">
                  {submitError}
                </p>
              )}

              {submitted && (
                <p className="text-[12.5px] text-[#5E5951]">
                  Thank you. Your inquiry has been emailed to our concierge team, and a confirmation receipt has been sent to your inbox.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactFormSection

