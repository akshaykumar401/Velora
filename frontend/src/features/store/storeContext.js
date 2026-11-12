import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../../App/hooks.js'
import {
  addCustomerAddress,
  addCustomerCartItem,
  clearCustomerCart,
  editCustomerAddress,
  makeDefaultCustomerAddress,
  placeCustomerOrder,
  removeCustomerAddress,
  removeCustomerCartItem,
  toggleCustomerWishlist,
  updateCustomerCartQty,
  updateCustomerProfile,
} from './customerSlice.js'

export const getCartItemKey = (productId, size, color) =>
  `${productId}__${size || 'default'}__${color || 'default'}`

export const useStore = () => {
  const dispatch = useAppDispatch()
  const customer = useAppSelector((state) => state.customer)
  const catalogProducts = useAppSelector((state) => state.catalog.products)

  const productMap = useMemo(
    () => new Map(catalogProducts.map((p) => [p.id, p])),
    [catalogProducts],
  )

  const detailedCartItems = useMemo(
    () =>
      customer.cartItems
        .map((item) => {
          const resolvedProduct = item.product || productMap.get(item.productId)
          if (!resolvedProduct) return null
          return {
            ...item,
            product: resolvedProduct,
          }
        })
        .filter(Boolean),
    [customer.cartItems, productMap],
  )

  const cartCount = useMemo(
    () => detailedCartItems.reduce((sum, item) => sum + item.quantity, 0),
    [detailedCartItems],
  )

  const cartSubtotal = useMemo(
    () =>
      detailedCartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),
    [detailedCartItems],
  )

  const wishlistProducts = useMemo(
    () =>
      customer.wishlistIds.map((id) => productMap.get(id)).filter(Boolean),
    [customer.wishlistIds, productMap],
  )

  const isWishlisted = useCallback(
    (productId) => customer.wishlistIds.includes(productId),
    [customer.wishlistIds],
  )

  const toggleWishlist = useCallback(
    (productId) => dispatch(toggleCustomerWishlist(productId)),
    [dispatch],
  )

  const addToCart = useCallback(
    (payload) => dispatch(addCustomerCartItem(payload)),
    [dispatch],
  )

  const updateCartQuantity = useCallback(
    (keyOrItemId, nextQuantity) => {
      const target = detailedCartItems.find(
        (i) => i._id === keyOrItemId || i.key === keyOrItemId,
      )
      const itemId = target?._id || keyOrItemId
      return dispatch(
        updateCustomerCartQty({ itemId, quantity: nextQuantity }),
      )
    },
    [dispatch, detailedCartItems],
  )

  const removeFromCart = useCallback(
    (keyOrItemId) => {
      const target = detailedCartItems.find(
        (i) => i._id === keyOrItemId || i.key === keyOrItemId,
      )
      const itemId = target?._id || keyOrItemId
      return dispatch(removeCustomerCartItem(itemId))
    },
    [dispatch, detailedCartItems],
  )

  const clearCart = useCallback(() => dispatch(clearCustomerCart()), [dispatch])

  const updateProfile = useCallback(
    (payload) => dispatch(updateCustomerProfile(payload)),
    [dispatch],
  )

  const saveAddress = useCallback(
    (addressInput) => {
      if (addressInput.id) {
        return dispatch(
          editCustomerAddress({
            addressId: addressInput.id,
            payload: addressInput,
          }),
        )
      }
      return dispatch(addCustomerAddress(addressInput))
    },
    [dispatch],
  )

  const deleteAddress = useCallback(
    (addressId) => dispatch(removeCustomerAddress(addressId)),
    [dispatch],
  )

  const setDefaultAddress = useCallback(
    (addressId) => dispatch(makeDefaultCustomerAddress(addressId)),
    [dispatch],
  )

  const placeOrder = useCallback(
    (orderPayload) => dispatch(placeCustomerOrder(orderPayload)).unwrap(),
    [dispatch],
  )

  const getOrderById = useCallback(
    (orderId) => customer.orders.find((order) => order.id === orderId),
    [customer.orders],
  )

  return {
    loading: customer.loading,
    error: customer.error,
    cartItems: detailedCartItems,
    cartCount,
    cartSubtotal,
    wishlistIds: customer.wishlistIds,
    wishlistProducts,
    wishlistCount: wishlistProducts.length,
    profile: customer.profile,
    addresses: customer.addresses,
    orders: customer.orders,
    isWishlisted,
    toggleWishlist,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    updateProfile,
    saveAddress,
    deleteAddress,
    setDefaultAddress,
    placeOrder,
    getOrderById,
  }
}
