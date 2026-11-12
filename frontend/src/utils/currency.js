const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export const EXPRESS_SHIPPING_THRESHOLD_INR = 4000
export const EXPRESS_SHIPPING_FEE_INR = 250

export const formatINR = (amount) => {
  const numeric = Number(amount)
  return inrFormatter.format(Number.isFinite(numeric) ? numeric : 0)
}

