export const ADMIN_DEMO_CREDENTIALS = {
  email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@velora.com',
  passcode: import.meta.env.VITE_ADMIN_PASSCODE || 'VELORA-ADMIN-2026',
}

export const DEFAULT_ADMIN_PROFILE = {
  name: 'Julian Mercer',
  role: 'Atelier Director',
  email: ADMIN_DEMO_CREDENTIALS.email,
  studio: 'Mercer Street Studio, New York',
  phone: '+1 (212) 555-0199',
}

export const ORDER_STATUS_OPTIONS = [
  'In Preparation',
  'Shipped',
  'Delivered',
  'Cancelled',
]

export const DEFAULT_ADMIN_ORDERS = [
  {
    id: 'VLR-2611-7410',
    customerName: 'Claire Moreau',
    customerEmail: 'claire.moreau@atelier-client.com',
    createdAt: '2026-11-10',
    status: 'In Preparation',
    deliveryMethod: 'Express Priority Air',
    paymentLast4: '8812',
    shippingAddress: {
      recipient: 'Claire Moreau',
      street: '14 Rue de Turenne',
      city: 'Paris',
      region: 'Île-de-France',
      postalCode: '75004',
      country: 'France',
    },
    items: [
      {
        productId: 'camel-belted-coat',
        name: 'Double-Faced Camel Wool Coat',
        category: 'OUTERWEAR',
        price: 980,
        size: 'S',
        color: 'Camel',
        quantity: 1,
      },
      {
        productId: 'mulberry-silk-shirt',
        name: 'Oversized Mulberry Silk Shirt',
        category: 'SILK SHIRTINGS',
        price: 290,
        size: 'S',
        color: 'Ivory',
        quantity: 1,
      },
    ],
    subtotal: 1270,
    shippingFee: 0,
    total: 1270,
  },
  {
    id: 'VLR-2611-6204',
    customerName: 'Henrik Lindqvist',
    customerEmail: 'henrik.l@nordic-studio.se',
    createdAt: '2026-11-08',
    status: 'Shipped',
    deliveryMethod: 'Standard Atelier Courier',
    paymentLast4: '1049',
    shippingAddress: {
      recipient: 'Henrik Lindqvist',
      street: 'Strandvägen 29',
      city: 'Stockholm',
      region: 'Stockholm',
      postalCode: '114 56',
      country: 'Sweden',
    },
    items: [
      {
        productId: 'charcoal-wool-blazer',
        name: 'Single-Breasted Charcoal Blazer',
        category: 'TAILORING',
        price: 780,
        size: '40',
        color: 'Charcoal Slate',
        quantity: 1,
      },
      {
        productId: 'pleat-trousers',
        name: 'Architectural Pleat Trousers',
        category: 'TAILORING',
        price: 420,
        size: '32',
        color: 'Anthracite',
        quantity: 1,
      },
    ],
    subtotal: 1200,
    shippingFee: 0,
    total: 1200,
  },
  {
    id: 'VLR-2610-4821',
    customerName: 'Elena Vance',
    customerEmail: 'elena.vance@velora-client.com',
    createdAt: '2026-10-18',
    status: 'Delivered',
    deliveryMethod: 'Standard Atelier Courier',
    paymentLast4: '4242',
    shippingAddress: {
      recipient: 'Elena Vance',
      street: '412 Mercer Street, Apt 6B',
      city: 'New York',
      region: 'NY',
      postalCode: '10013',
      country: 'United States',
    },
    items: [
      {
        productId: 'merino-pullover',
        name: 'Merino Wool Blend Pullover',
        category: 'CASHMERE KNITWEAR',
        price: 320,
        size: 'M',
        color: 'Oatmeal',
        quantity: 1,
      },
      {
        productId: 'structured-tote',
        name: 'The Structured Tote',
        category: 'LEATHER GOODS',
        price: 650,
        size: 'One Size',
        color: 'Obsidian Black',
        quantity: 1,
      },
    ],
    subtotal: 970,
    shippingFee: 0,
    total: 970,
  },
]

export const DEFAULT_REVIEWS = [
  {
    id: 'rev-1',
    productId: 'merino-pullover',
    productName: 'Merino Wool Blend Pullover',
    author: 'Elena V.',
    rating: 5,
    comment:
      'Extraordinary rib density and warmth without weight. Holds its clean shoulder silhouette after travel.',
    createdAt: '2026-11-05',
    status: 'Published',
  },
  {
    id: 'rev-2',
    productId: 'structured-tote',
    productName: 'The Structured Tote',
    author: 'Sofia R.',
    rating: 5,
    comment:
      'The Italian calfskin grain is supple yet holds its architectural profile upright. Easily fits a 14-inch laptop.',
    createdAt: '2026-11-02',
    status: 'Published',
  },
  {
    id: 'rev-3',
    productId: 'pleat-trousers',
    productName: 'Architectural Pleat Trousers',
    author: 'Marcus D.',
    rating: 4,
    comment:
      'Immaculate drape in the worsted wool. Hem runs generously long to allow custom atelier tailoring.',
    createdAt: '2026-11-09',
    status: 'Pending',
  },
  {
    id: 'rev-4',
    productId: 'camel-belted-coat',
    productName: 'Double-Faced Camel Wool Coat',
    author: 'Camille L.',
    rating: 5,
    comment:
      'Hand-finished seams inside and out feel genuinely heirloom grade. Worth every penny.',
    createdAt: '2026-11-10',
    status: 'Pending',
  },
]

