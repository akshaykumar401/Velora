import { createContext, useContext } from 'react'

export const StoreContext = createContext(null)

export const getCartItemKey = (productId, size, color) =>
  `${productId}__${size || 'default'}__${color || 'default'}`

export const useStore = () => {
  const ctx = useContext(StoreContext)
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return ctx
}

