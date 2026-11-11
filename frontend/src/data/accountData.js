export const DEFAULT_PROFILE = {
  fullName: 'Elena Vance',
  email: 'elena.vance@velora-client.com',
  phone: '+1 (212) 555-0184',
  preferredSize: 'M',
  newsletterOptIn: true,
}

export const DEFAULT_ADDRESSES = [
  {
    id: 'addr-1',
    label: 'Primary Residence',
    recipient: 'Elena Vance',
    street: '412 Mercer Street, Apt 6B',
    city: 'New York',
    region: 'NY',
    postalCode: '10013',
    country: 'United States',
    phone: '+1 (212) 555-0184',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Atelier Studio',
    recipient: 'Elena Vance',
    street: '88 Crosby Street, Floor 3',
    city: 'New York',
    region: 'NY',
    postalCode: '10012',
    country: 'United States',
    phone: '+1 (212) 555-0184',
    isDefault: false,
  },
]

export const DEFAULT_ORDERS = [
  {
    id: 'VLR-2610-4821',
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

