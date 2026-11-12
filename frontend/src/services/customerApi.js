import { apiClient, enrichProductMedia } from './apiClient.js'

const enrichCartList = (items = []) =>
  items.map((item) => ({
    ...item,
    product: item.product ? enrichProductMedia(item.product) : null,
  }))

export const customerApi = {
  async syncSession(profileSeed = {}) {
    const { data } = await apiClient.post('/users/sync', profileSeed)
    const user = data.data
    return {
      ...user,
      cartItems: enrichCartList(user?.cartItems || []),
    }
  },

  async updateProfile(profilePayload) {
    const { data } = await apiClient.patch('/users/profile', profilePayload)
    const user = data.data
    return {
      ...user,
      cartItems: enrichCartList(user?.cartItems || []),
    }
  },

  async addAddress(addressPayload) {
    const { data } = await apiClient.post('/users/addresses', addressPayload)
    return data.data || []
  },

  async updateAddress(addressId, addressPayload) {
    const { data } = await apiClient.patch(
      `/users/addresses/${addressId}`,
      addressPayload,
    )
    return data.data || []
  },

  async deleteAddress(addressId) {
    const { data } = await apiClient.delete(`/users/addresses/${addressId}`)
    return data.data || []
  },

  async setDefaultAddress(addressId) {
    const { data } = await apiClient.patch(
      `/users/addresses/${addressId}/default`,
    )
    return data.data || []
  },

  async toggleWishlist(productId) {
    const { data } = await apiClient.post('/users/wishlist/toggle', {
      productId,
    })
    return data.data || []
  },

  async addToCart(payload) {
    const { data } = await apiClient.post('/users/cart', payload)
    return enrichCartList(data.data || [])
  },

  async updateCartItem(itemId, quantity) {
    const { data } = await apiClient.patch(`/users/cart/${itemId}`, {
      quantity,
    })
    return enrichCartList(data.data || [])
  },

  async removeCartItem(itemId) {
    const { data } = await apiClient.delete(`/users/cart/${itemId}`)
    return enrichCartList(data.data || [])
  },

  async clearCart() {
    const { data } = await apiClient.delete('/users/cart')
    return data.data || []
  },

  async getPaymentConfig() {
    const { data } = await apiClient.get('/orders/payment/config')
    return data.data
  },

  async createRazorpayOrder(orderPayload) {
    const { data } = await apiClient.post(
      '/orders/razorpay/create-order',
      orderPayload,
    )
    return data.data
  },

  async verifyRazorpayPayment(verificationPayload) {
    const { data } = await apiClient.post(
      '/orders/razorpay/verify',
      verificationPayload,
    )
    return data.data
  },

  async fetchMyOrders() {
    const { data } = await apiClient.get('/orders/my')
    return data.data || []
  },

  async fetchMyOrderById(orderId) {
    const { data } = await apiClient.get(`/orders/my/${orderId}`)
    return data.data
  },
}

