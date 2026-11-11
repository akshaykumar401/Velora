export const CLERK_PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim() || ''

export const isClerkConfigured = Boolean(
  CLERK_PUBLISHABLE_KEY &&
    !CLERK_PUBLISHABLE_KEY.includes('your_clerk_publishable_key_here'),
)

export const veloraClerkAppearance = {
  variables: {
    colorPrimary: '#151413',
    colorBackground: '#FCF9F2',
    colorText: '#1A1816',
    colorTextSecondary: '#6D6860',
    colorInputBackground: '#F6F3EC',
    colorInputText: '#1A1816',
    colorNeutral: '#1A1816',
    borderRadius: '0px',
    fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
  },
  elements: {
    rootBox: 'w-full',
    cardBox: 'w-full shadow-none border border-[#E5DFD3] bg-[#FCF9F2]',
    card: 'shadow-none bg-[#FCF9F2] p-6 sm:p-8',
    headerTitle:
      'font-serif text-[26px] font-normal text-[#1A1816] tracking-normal',
    headerSubtitle: 'text-[12.5px] text-[#6D6860]',
    socialButtonsBlockButton:
      'border border-[#D8D1C5] bg-[#FCF9F2] hover:bg-[#F6F3EC] text-[#1A1816] text-[12px] rounded-none shadow-none transition-colors',
    dividerLine: 'bg-[#E5DFD3]',
    dividerText: 'text-[10px] tracking-[0.18em] uppercase text-[#8A8379]',
    formFieldLabel:
      'text-[10px] tracking-[0.18em] uppercase text-[#78736B] font-normal',
    formFieldInput:
      'bg-[#F6F3EC] border border-[#D8D1C5] text-[#1A1816] text-[13px] rounded-none focus:border-[#1A1816] focus:ring-0',
    formButtonPrimary:
      'bg-[#0F0E0D] hover:bg-[#2B2825] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase rounded-none py-3 shadow-none transition-colors',
    footerActionLink:
      'text-[#1A1816] underline underline-offset-4 hover:opacity-75',
    footer: 'bg-[#F6F3EC] border-t border-[#EAE5DC]',
  },
}

