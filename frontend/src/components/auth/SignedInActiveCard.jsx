import { Link } from 'react-router-dom'

const SignedInActiveCard = ({
  title = 'You are already signed in',
  description = 'Continue to your client account or browse the seasonal collection.',
}) => {
  return (
    <div className="border border-[#E5DFD3] bg-[#F6F3EC] p-7 text-center">
      <p className="text-[10px] tracking-[0.22em] uppercase text-[#8A8379] mb-2">
        SESSION ACTIVE
      </p>
      <h2 className="font-serif text-[26px] text-[#1A1816] mb-3">{title}</h2>
      <p className="text-[13px] text-[#5E5951] mb-6">{description}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to="/profile"
          className="px-6 py-3 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors"
        >
          MY PROFILE
        </Link>
        <Link
          to="/shop"
          className="px-6 py-3 border border-[#CFC9BE] text-[10.5px] font-medium tracking-[0.2em] uppercase text-[#1A1816] hover:border-[#1A1816] transition-colors"
        >
          EXPLORE SHOP
        </Link>
      </div>
    </div>
  )
}

export default SignedInActiveCard

