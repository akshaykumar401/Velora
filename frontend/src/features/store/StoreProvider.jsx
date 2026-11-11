import { useCallback, useEffect, useMemo, useState } from 'react'
import { PRODUCTS } from '../../data/catalogData.js'
import {
  DEFAULT_ADDRESSES,
  DEFAULT_ORDERS,
  DEFAULT_PROFILE,
} from '../../data/accountData.js'
import { useAuthStatus } from '../auth/authContext.js'
import { StoreContext, getCartItemKey } from './storeContext.js'

const readStorage = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const writeStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage quota / privacy mode errors
  }
}

const UserScopedStoreProvider = ({ user, children }) => {
  const scope = user?.id || 'member'
  const cartKey = `velora_${scope}_cart`
  const wishlistKey = `velora_${scope}_wishlist`
  const profileKey = `velora_${scope}_profile`
  const addressesKey = `velora_${scope}_addresses`
  const ordersKey = `velora_${scope}_orders`

  const initialProfile = useMemo(
    () => ({
      ...DEFAULT_PROFILE,
      fullName: user?.fullName || DEFAULT_PROFILE.fullName,
      email: user?.primaryEmailAddress?.emailAddress || DEFAULT_PROFILE.email,
    }),
    [user?.fullName, user?.primaryEmailAddress?.emailAddress],
  )

  const [cartItems, setCartItems] = useState(() => readStorage(cartKey, []))
  const [wishlistIds, setWishlistIds] = useState(() =>
    readStorage(wishlistKey, []),
  )
  const [profile, setProfile] = useState(() =>
    readStorage(profileKey, initialProfile),
  )
  const [addresses, setAddresses] = useState(() =>
    readStorage(addressesKey, DEFAULT_ADDRESSES),
  )
  const [orders, setOrders] = useState(() =>
    readStorage(ordersKey, DEFAULT_ORDERS),
  )

  useEffect(() => writeStorage(cartKey, cartItems), [cartKey, cartItems])
  useEffect(
    () => writeStorage(wishlistKey, wishlistIds),
    [wishlistKey, wishlistIds],
  )
  useEffect(() => writeStorage(profileKey, profile), [profileKey, profile])
  useEffect(
    () => writeStorage(addressesKey, addresses),
    [addressesKey, addresses],
  )
  useEffect(() => writeStorage(ordersKey, orders), [ordersKey, orders])

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

  const updateProfile = useCallback((nextProfile) => {
    setProfile((prev) => ({ ...prev, ...nextProfile }))
  }, [])

  const saveAddress = useCallback((addressInput) => {
    setAddresses((prev) => {
      const makeDefault = Boolean(addressInput.isDefault) || prev.length === 0
      const baseList = makeDefault
        ? prev.map((addr) => ({ ...addr, isDefault: false }))
        : prev

      if (addressInput.id) {
        return baseList.map((addr) =>
          addr.id === addressInput.id
            ? { ...addr, ...addressInput, isDefault: makeDefault }
            : addr,
        )
      }

      const newAddress = {
        ...addressInput,
        id: `addr-${Date.now()}`,
        isDefault: makeDefault,
      }
      return [newAddress, ...baseList]
    })
  }, [])

  const deleteAddress = useCallback((id) => {
    setAddresses((prev) => {
      const remaining = prev.filter((addr) => addr.id !== id)
      if (remaining.length > 0 && !remaining.some((addr) => addr.isDefault)) {
        remaining[0] = { ...remaining[0], isDefault: true }
      }
      return remaining
    })
  }, [])

  const setDefaultAddress = useCallback((id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({ ...addr, isDefault: addr.id === id })),
    )
  }, [])

  const placeOrder = useCallback(
    ({
      shippingAddress,
      deliveryMethod,
      shippingFee = 0,
      paymentLast4 = '4242',
    }) => {
      const productById = new Map(PRODUCTS.map((p) => [p.id, p]))
      const snapshotItems = cartItems
        .map((item) => {
          const product = productById.get(item.productId)
          if (!product) return null
          return {
            productId: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          }
        })
        .filter(Boolean)

      const subtotal = snapshotItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      )
      const orderId = `VLR-${new Date().getFullYear().toString().slice(-2)}${String(
        new Date().getMonth() + 1,
      ).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`

      const newOrder = {
        id: orderId,
        createdAt: new Date().toISOString().slice(0, 10),
        status: 'In Preparation',
        deliveryMethod,
        paymentLast4,
        shippingAddress,
        items: snapshotItems,
        subtotal,
        shippingFee,
        total: subtotal + shippingFee,
      }

      setOrders((prev) => [newOrder, ...prev])
      setCartItems([])
      return newOrder
    },
    [cartItems],
  )

  const getOrderById = useCallback(
    (orderId) => orders.find((order) => order.id === orderId),
    [orders],
  )

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
      profile,
      updateProfile,
      addresses,
      saveAddress,
      deleteAddress,
      setDefaultAddress,
      orders,
      placeOrder,
      getOrderById,
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
    profile,
    updateProfile,
    addresses,
    saveAddress,
    deleteAddress,
    setDefaultAddress,
    orders,
    placeOrder,
    getOrderById,
  ])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const StoreProvider = ({ children }) => {
  const { isSignedIn, user } = useAuthStatus()

  const guestValue = useMemo(
    () => ({
      cartItems: [],
      cartCount: 0,
      cartSubtotal: 0,
      wishlistIds: [],
      wishlistProducts: [],
      wishlistCount: 0,
      toggleWishlist: () => {},
      isWishlisted: () => false,
      addToCart: () => {},
      updateCartQuantity: () => {},
      removeFromCart: () => {},
      clearCart: () => {},
      profile: DEFAULT_PROFILE,
      updateProfile: () => {},
      addresses: [],
      saveAddress: () => {},
      deleteAddress: () => {},
      setDefaultAddress: () => {},
      orders: [],
      placeOrder: () => null,
      getOrderById: () => undefined,
    }),
    [],
  )

  if (!isSignedIn) {
    return (
      <StoreContext.Provider value={guestValue}>{children}</StoreContext.Provider>
    )
  }

  return (
    <UserScopedStoreProvider key={user?.id || 'member'} user={user}>
      {children}
    </UserScopedStoreProvider>
  )
}
