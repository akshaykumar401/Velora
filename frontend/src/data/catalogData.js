import categoryAccessoriesImg from '../assets/images/category-accessories.jpg'
import productKnitwearImg from '../assets/images/product-knitwear.jpg'

export const CATEGORIES = [
  {
    id: 'women',
    slug: 'women',
    indexLabel: '01 / COLLECTION',
    title: 'Women',
    subtitle: 'Fluid silk draping, camel outerwear, and architectural knitwear.',
    itemCount: 4,
    featured: true,
    to: '/shop?category=women',
    image: null,
    placeholderBg:
      'bg-gradient-to-br from-[#D9CFC2] via-[#AFA190] to-[#5E5247]',
  },
  {
    id: 'men',
    slug: 'men',
    indexLabel: '02 / COLLECTION',
    title: 'Men',
    subtitle: 'Structured wool suiting, fine-gauge merino, and crisp shirtings.',
    itemCount: 3,
    featured: true,
    to: '/shop?category=men',
    image: null,
    placeholderBg:
      'bg-gradient-to-br from-[#8D8D89] via-[#515354] to-[#232527]',
  },
  {
    id: 'accessories',
    slug: 'accessories',
    indexLabel: '03 / ESSENTIALS',
    title: 'Accessories',
    subtitle: 'Full-grain Italian calfskin bags, scarves, and sculptural leather goods.',
    itemCount: 3,
    featured: true,
    to: '/shop?category=accessories',
    image: categoryAccessoriesImg,
    placeholderBg:
      'bg-gradient-to-br from-[#D6C7B5] via-[#9D8B77] to-[#3B332C]',
  },
  {
    id: 'knitwear',
    slug: 'knitwear',
    indexLabel: '04 / ARCHIVE',
    title: 'Cashmere Knitwear',
    subtitle: 'Heavyweight ribbed pullovers and brushed highland yarns.',
    itemCount: 2,
    featured: false,
    to: '/shop?category=knitwear',
    image: productKnitwearImg,
    placeholderBg:
      'bg-gradient-to-br from-[#DFD5C6] via-[#BBAE9B] to-[#6E6356]',
  },
  {
    id: 'tailoring',
    slug: 'tailoring',
    indexLabel: '05 / ATELIER',
    title: 'Tailoring',
    subtitle: 'Sharp double-breasted coats and single-pleat wool trousers.',
    itemCount: 2,
    featured: false,
    to: '/shop?category=tailoring',
    image: null,
    placeholderBg:
      'bg-gradient-to-br from-[#C5BFB6] via-[#7A7670] to-[#2F2D2A]',
  },
  {
    id: 'silk',
    slug: 'silk',
    indexLabel: '06 / ESSENTIALS',
    title: 'Silk & Shirtings',
    subtitle: 'Luminous mulberry silk blouses and minimalist everyday shirts.',
    itemCount: 2,
    featured: false,
    to: '/shop?category=silk',
    image: null,
    placeholderBg:
      'bg-gradient-to-br from-[#EFEAE0] via-[#D2C7B5] to-[#877B6C]',
  },
]

export const PRODUCTS = [
  {
    id: 'merino-pullover',
    category: 'CASHMERE KNITWEAR',
    department: 'women',
    tags: ['women', 'knitwear'],
    name: 'Merino Wool Blend Pullover',
    price: 320,
    featuredOrder: 1,
    to: '/product/merino-pullover',
    image: productKnitwearImg,
    description:
      'Knitted in Biella from a lofty blend of combed Mongolian cashmere and extrafine merino wool. Designed with an architectural saddle shoulder, clean crew neckline, and dense fisherman rib that holds its form across seasons.',
    fabric: '70% Extrafine Merino Wool, 30% Mongolian Cashmere · Made in Italy',
    care: 'Hand wash cold with wool detergent and dry flat on a cotton towel.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Oatmeal', hex: '#D6CCB9' },
      { name: 'Espresso', hex: '#4A3C31' },
      { name: 'Charcoal', hex: '#2B2A29' },
    ],
  },
  {
    id: 'pleat-trousers',
    category: 'TAILORING',
    department: 'men',
    tags: ['men', 'tailoring'],
    name: 'Architectural Pleat Trousers',
    price: 420,
    featuredOrder: 2,
    to: '/product/pleat-trousers',
    image: null,
    placeholderTone: 'bg-gradient-to-b from-[#EDE6DB] to-[#DDD4C7]',
    description:
      'Cut with a high rise and double forward pleats for fluid movement from waist to ankle. Tailored from high-twist virgin wool that naturally resists creasing while maintaining a sharp crease.',
    fabric: '100% Virgin Worsted Wool · Woven in Yorkshire, UK',
    care: 'Dry clean only. Steam lightly between wears to restore drape.',
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Anthracite', hex: '#2D2F31' },
      { name: 'Warm Taupe', hex: '#8F8578' },
    ],
  },
  {
    id: 'structured-tote',
    category: 'LEATHER GOODS',
    department: 'accessories',
    tags: ['accessories', 'women'],
    name: 'The Structured Tote',
    price: 650,
    featuredOrder: 3,
    to: '/product/structured-tote',
    image: categoryAccessoriesImg,
    description:
      'Hand-assembled from supple full-grain vegetable-tanned calfskin with raw painted edges and minimal brushed brass hardware. Sized to carry daily essentials and a 14-inch notebook with effortless poise.',
    fabric: '100% Full-Grain Italian Calfskin · Cotton Twill Lining',
    care: 'Condition sparingly with neutral leather balm and store in its dust bag.',
    sizes: ['One Size'],
    colors: [
      { name: 'Obsidian Black', hex: '#181818' },
      { name: 'Saddle Cognac', hex: '#7A5438' },
    ],
  },
  {
    id: 'mulberry-silk-shirt',
    category: 'SILK SHIRTINGS',
    department: 'women',
    tags: ['women', 'silk'],
    name: 'Oversized Mulberry Silk Shirt',
    price: 290,
    featuredOrder: 4,
    to: '/product/mulberry-silk-shirt',
    image: null,
    placeholderTone: 'bg-gradient-to-b from-[#F4EFE6] to-[#E6DEC9]',
    description:
      'Relaxed yet refined button-down crafted from 22-momme matte mulberry silk crepe de chine. Features mother-of-pearl buttons, dropped shoulders, and elongated cuffs.',
    fabric: '100% Organic Mulberry Silk (22 Momme) · Como, Italy',
    care: 'Hand wash cold or specialist silk dry clean. Cool iron on reverse.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Ivory', hex: '#F3EEE3' },
      { name: 'Champagne', hex: '#DFD2BC' },
    ],
  },
  {
    id: 'camel-belted-coat',
    category: 'OUTERWEAR',
    department: 'women',
    tags: ['women', 'tailoring'],
    name: 'Double-Faced Camel Wool Coat',
    price: 980,
    featuredOrder: 5,
    to: '/product/camel-belted-coat',
    image: null,
    placeholderTone: 'bg-gradient-to-b from-[#E7DCCB] to-[#D5C3AA]',
    description:
      'Our signature winter overcoat hand-stitched in double-faced virgin wool and camel hair for an unlined, weightless drape. Finished with wide peak lapels and a tonal waist belt.',
    fabric: '80% Virgin Wool, 20% Camel Hair · Hand-Finished Seams',
    care: 'Specialist dry clean only. Brush lightly along the nap with a garment brush.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Camel', hex: '#C2A382' },
      { name: 'Noir', hex: '#1B1A19' },
    ],
  },
  {
    id: 'ribbed-cashmere-scarf',
    category: 'ACCESSORIES',
    department: 'accessories',
    tags: ['accessories', 'knitwear'],
    name: 'Ribbed Cashmere Wrap Scarf',
    price: 210,
    featuredOrder: 6,
    to: '/product/ribbed-cashmere-scarf',
    image: productKnitwearImg,
    description:
      'Generously proportioned cold-weather wrap knitted in seamless 2-ply cashmere rib for plush softness against the skin.',
    fabric: '100% Grade-A Cashmere · Spun in Scotland',
    care: 'Hand wash cold with mild cashmere wash; reshape and dry flat.',
    sizes: ['One Size'],
    colors: [
      { name: 'Sandstone', hex: '#CFC4B4' },
      { name: 'Charcoal', hex: '#343332' },
    ],
  },
  {
    id: 'charcoal-wool-blazer',
    category: 'TAILORING',
    department: 'men',
    tags: ['men', 'tailoring'],
    name: 'Single-Breasted Charcoal Blazer',
    price: 780,
    featuredOrder: 7,
    to: '/product/charcoal-wool-blazer',
    image: null,
    placeholderTone: 'bg-gradient-to-b from-[#DFE0DF] to-[#C8C9C7]',
    description:
      'Half-canvassed tailored jacket engineered with soft natural shoulders and horn buttons, balancing boardroom structure with weekend ease.',
    fabric: '100% Super 130s Virgin Wool · Bemberg Cupro Lining',
    care: 'Dry clean sparingly; air on a sculpted cedar hanger after wear.',
    sizes: ['38', '40', '42', '44'],
    colors: [{ name: 'Charcoal Slate', hex: '#3A3C3E' }],
  },
  {
    id: 'poplin-atelier-shirt',
    category: 'SILK SHIRTINGS',
    department: 'men',
    tags: ['men', 'silk'],
    name: 'Poplin Atelier Dress Shirt',
    price: 260,
    featuredOrder: 8,
    to: '/product/poplin-atelier-shirt',
    image: null,
    placeholderTone: 'bg-gradient-to-b from-[#F5F2EB] to-[#E6E0D3]',
    description:
      'Crisp long-staple Egyptian cotton poplin shirting with single-needle French seams, subtle spread collar, and natural trocas shell buttons.',
    fabric: '100% Two-Fold Egyptian Cotton Poplin · 120/2 Yarn',
    care: 'Machine wash cold gentle cycle; hang dry and press with steam.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Alabaster', hex: '#F6F3EB' },
      { name: 'Mist Blue', hex: '#CBD4DB' },
    ],
  },
  {
    id: 'grained-weekender-bag',
    category: 'LEATHER GOODS',
    department: 'accessories',
    tags: ['accessories', 'men'],
    name: 'Grained Calfskin Weekender',
    price: 890,
    featuredOrder: 9,
    to: '/product/grained-weekender-bag',
    image: categoryAccessoriesImg,
    description:
      'Architectural overnight holdall in tumbled pebble calfskin with rolled leather handles, detachable shoulder strap, and brass protective feet.',
    fabric: '100% Tumbled Calfskin · Solid Brushed Brass Hardware',
    care: 'Wipe clean with a soft dry cloth and store stuffed to preserve shape.',
    sizes: ['One Size'],
    colors: [{ name: 'Matte Black', hex: '#1A1A1A' }],
  },
]

export const SHOP_FILTER_OPTIONS = [
  { label: 'All Pieces', value: 'all' },
  { label: 'Women', value: 'women' },
  { label: 'Men', value: 'men' },
  { label: 'Accessories', value: 'accessories' },
  { label: 'Knitwear', value: 'knitwear' },
  { label: 'Tailoring', value: 'tailoring' },
  { label: 'Silk', value: 'silk' },
]

export const ATELIER_MATERIALS = [
  {
    index: '01',
    title: 'Mongolian Cashmere',
    description:
      'Long-staple combed fibers spun in family-run Italian mills for warmth and featherlight drape.',
  },
  {
    index: '02',
    title: 'Mulberry Silk',
    description:
      '22-momme organic silk twill finished with a matte lustre that softens effortlessly with wear.',
  },
  {
    index: '03',
    title: 'Full-Grain Calfskin',
    description:
      'Vegetable-tanned hides selected for architectural structure and subtle patina over decades.',
  },
  {
    index: '04',
    title: 'Virgin Merino Wool',
    description:
      'Traceable high-twist worsted wool tailored to hold crisp lines from morning into evening.',
  },
]

export const getProductById = (id) =>
  PRODUCTS.find((product) => product.id === id)

export const getRelatedProducts = (product, limit = 4) => {
  if (!product) return PRODUCTS.slice(0, limit)
  const others = PRODUCTS.filter((item) => item.id !== product.id)
  const prioritized = [
    ...others.filter(
      (item) =>
        item.department === product.department ||
        item.category === product.category,
    ),
    ...others.filter(
      (item) =>
        item.department !== product.department &&
        item.category !== product.category,
    ),
  ]
  return prioritized.slice(0, limit)
}
