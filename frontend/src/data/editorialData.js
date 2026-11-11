import categoryAccessoriesImg from '../assets/images/category-accessories.jpg'
import productKnitwearImg from '../assets/images/product-knitwear.jpg'
import { PRODUCTS } from './catalogData.js'

export const COLLECTIONS = [
  {
    id: 'autumn-winter-26',
    season: 'CAPSULE 01 · AUTUMN / WINTER',
    title: 'Architectural Warmth',
    description:
      'Sculpted double-faced coats, lofty fisherman-rib merino, and understated earth tones built for crisp northern mornings.',
    ctaTo: '/shop?category=women',
    coverImage: productKnitwearImg,
    productIds: ['camel-belted-coat', 'merino-pullover', 'ribbed-cashmere-scarf'],
  },
  {
    id: 'monochrome-tailoring',
    season: 'CAPSULE 02 · ATELIER TAILORING',
    title: 'Monochrome Form',
    description:
      'High-twist virgin wool suiting, architectural pleat trousers, and crisp two-fold poplin engineered for effortless proportion.',
    ctaTo: '/shop?category=men',
    coverImage: null,
    placeholderBg: 'bg-gradient-to-br from-[#8F8E8A] via-[#515354] to-[#232527]',
    productIds: ['pleat-trousers', 'charcoal-wool-blazer', 'poplin-atelier-shirt'],
  },
  {
    id: 'leather-atelier',
    season: 'CAPSULE 03 · PERMANENT ESSENTIALS',
    title: 'Objects of Permanence',
    description:
      'Vegetable-tanned Italian calfskin bags and pure 22-momme mulberry silk staples designed to acquire patina across decades.',
    ctaTo: '/shop?category=accessories',
    coverImage: categoryAccessoriesImg,
    productIds: ['structured-tote', 'mulberry-silk-shirt', 'grained-weekender-bag'],
  },
].map((collection) => ({
  ...collection,
  products: collection.productIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean),
}))

export const SUSTAINABILITY_PILLARS = [
  {
    index: '01 / PROVENANCE',
    title: 'Traceable European Mills',
    description:
      'Over 92% of our textiles originate from third-generation family mills in Biella, Como, and Yorkshire audited for clean water stewardship.',
  },
  {
    index: '02 / LONGEVITY',
    title: 'Seasonless Construction',
    description:
      'French seams, horn and mother-of-pearl hardware, and generous seam allowances ensure every garment can be tailored and worn for decades.',
  },
  {
    index: '03 / PACKAGING',
    title: 'Plastic-Free Dispatch',
    description:
      'Orders arrive in FSC-certified recycled archival boxes wrapped in unbleached organic cotton dust bags with soy-based inks.',
  },
]

export const ATELIER_STANDARDS = [
  { label: 'Natural & Traceable Fibers', value: '100%' },
  { label: 'European Partner Mills', value: '14' },
  { label: 'Complimentary Alterations Window', value: 'Lifetime' },
  { label: 'Carbon-Neutral Courier Dispatch', value: 'All Orders' },
]

export const SHIPPING_METHODS = [
  {
    title: 'Standard Atelier Courier',
    timing: '3–5 Business Days',
    cost: 'Complimentary',
    notes: 'Carbon-neutral tracked delivery in plastic-free archival packaging.',
  },
  {
    title: 'Express Priority Air',
    timing: '1–2 Business Days',
    cost: 'Complimentary over $400 · $25 under',
    notes: 'Signature required on arrival with full transit insurance.',
  },
  {
    title: 'Private Showroom Collection',
    timing: 'Same Day Ready',
    cost: 'Complimentary',
    notes: 'Collect with optional on-site pinning and fitting consultation.',
  },
]

export const RETURN_STEPS = [
  {
    step: '01',
    title: 'Initiate Request',
    description:
      'Select pieces within 30 days of delivery in unworn condition with original tags and cotton dust bag.',
  },
  {
    step: '02',
    title: 'Complimentary Pickup',
    description:
      'Print your prepaid courier label or schedule a doorstep collection through our Client Concierge.',
  },
  {
    step: '03',
    title: 'Swift Inspection & Refund',
    description:
      'Refunds are processed back to your original payment method within 3 business days of atelier inspection.',
  },
]

export const FAQ_CATEGORIES = [
  'All',
  'Orders & Sizing',
  'Shipping & Delivery',
  'Returns & Exchanges',
  'Garment Care',
]

export const FAQ_ITEMS = [
  {
    id: 'sizing-fit',
    category: 'Orders & Sizing',
    question: 'How do Velora garments fit across outerwear and knitwear?',
    answer:
      'Our outerwear and silk shirtings are tailored with relaxed architectural ease so they layer smoothly over knitwear. Take your usual size for the intended drape, or size down if you prefer a closer shoulder line.',
  },
  {
    id: 'modify-order',
    category: 'Orders & Sizing',
    question: 'Can I amend or cancel my order after placing it?',
    answer:
      'Orders begin preparation within two hours of confirmation. Contact concierge@velora.com as soon as possible and our atelier team will gladly update sizing or shipping details prior to dispatch.',
  },
  {
    id: 'shipping-times',
    category: 'Shipping & Delivery',
    question: 'Do you ship internationally and include duties?',
    answer:
      'Yes. Velora dispatches worldwide via DHL Express and UPS Carbon Neutral. Applicable import duties and regional taxes are calculated transparently prior to checkout completion.',
  },
  {
    id: 'return-policy',
    category: 'Returns & Exchanges',
    question: 'What is your return and size-exchange policy?',
    answer:
      'Unworn pieces with original tags intact may be returned or exchanged free of charge within 30 days of receipt. Size exchanges dispatch as soon as the return parcel is scanned by the courier.',
  },
  {
    id: 'cashmere-care',
    category: 'Garment Care',
    question: 'How should I care for cashmere and mulberry silk pieces?',
    answer:
      'Air knitwear between wears and hand wash sparingly in cool water with mild wool cleanser, drying flat away from direct heat. Steam mulberry silk gently on the reverse rather than pressing directly.',
  },
  {
    id: 'leather-conditioning',
    category: 'Garment Care',
    question: 'Does full-grain calfskin require waterproofing treatment?',
    answer:
      'Our Italian hides carry a subtle natural wax finish. Wipe away moisture promptly with a soft lint-free cloth and condition once or twice a year with neutral leather balm.',
  },
]

