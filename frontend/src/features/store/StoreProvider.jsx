import { useCallback, useEffect, useMemo, useState } from 'react'
import { PRODUCTS } from '../../data/catalogData.js'
import { StoreContext, getCartItemKey } from './storeContext.js'

const CART_STORAGE_KEY = 'velora_cart_items'
const WISHLIST_STORAGE_KEY = 'velora_wishlist_ids'

const readStorage = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export const StoreProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() =>
    readStorage(CART_STORAGE_KEY, []),
  )
  const [wishlistIds, setWishlistIds] = useState(() =>
    readStorage(WISHLIST_STORAGE_KEY, []),
  )

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
    } catch {
      // Ignore storage quota / privacy mode errors
    }
  }, [cartItems])

  useEffect(() => {
    try {
      window.localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(wishlistIds),
      )
    } catch {
      // Ignore storage quota / privacy mode errors
    }
  }, [wishlistIds])

  const toggleWishlist = useCallback((productId) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    )
  }, [])

  const isWishlisted = useCallback(
    (productId) => wishlistIds.includes(productId),
    [wishlistIds],
  )

  const addToCart = useCallback(({ productId, size, color, quantity = 1 }) => {
    if (!productId || quantity < 1) return
    const key = getCartItemKey(productId, size, color)

    setCartItems((prev) => {
      const existing = prev.find((item) => item.key === key)
      if (existing) {
        return prev.map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }
      return [...prev, { key, productId, size, color, quantity }]
    })
  }, [])

  const updateCartQuantity = useCallback((key, nextQuantity) => {
    if (nextQuantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.key !== key))
      return
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, quantity: nextQuantity } : item,
      ),
    )
  }, [])

  const removeFromCart = useCallback((key) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key))
  }, [])

  const clearCart = useCallback(() => setCartItems([]), [])

  const value = useMemo(() => {
    const productById = new Map(PRODUCTS.map((p) => [p.id, p]))
    const detailedCartItems = cartItems
      .map((item) => {
        const product = productById.get(item.productId)
        if (!product) return null
        return { ...item, product }
      })
      .filter(Boolean)

    const cartCount = detailedCartItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    )
    const cartSubtotal = detailedCartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    )
    const wishlistProducts = wishlistIds
      .map((id) => productById.get(id))
      .filter(Boolean)

    return {
      cartItems: detailedCartItems,
      cartCount,
      cartSubtotal,
      wishlistIds,
      wishlistProducts,
      wishlistCount: wishlistProducts.length,
      toggleWishlist,
      isWishlisted,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
    }
  }, [
    cartItems,
    wishlistIds,
    toggleWishlist,
    isWishlisted,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  ])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

