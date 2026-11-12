import {
  adminApiClient,
  enrichCategoryMedia,
  enrichProductMedia,
  enrichSiteSettingsMedia,
  resolveMediaUrl,
} from './apiClient.js'

const enrichReviewMedia = (review) =>
  review
    ? { ...review, productImage: resolveMediaUrl(review.productImage) }
    : review

const buildUploadPayload = (payload) => {
  const hasFile =
    payload?.imageFile || payload?.heroImageFile || payload?.philosophyImageFile
  if (!hasFile) return payload

  const formData = new FormData()
  const { imageFile, heroImageFile, philosophyImageFile, ...fields } = payload
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined) return
    if (value === null) {
      formData.append(key, '')
    } else if (Array.isArray(value) || typeof value === 'object') {
      formData.append(key, JSON.stringify(value))
    } else {
      formData.append(key, String(value))
    }
  })
  if (imageFile) formData.append('image', imageFile)
  if (heroImageFile) formData.append('heroImage', heroImageFile)
  if (philosophyImageFile) formData.append('philosophyImage', philosophyImageFile)
  return formData
}

export const adminApi = {
  async login(credentials) {
    const { data } = await adminApiClient.post('/admin/login', credentials)
    return data.data
  },

  async logout() {
    await adminApiClient.post('/admin/logout')
  },

  async fetchMe() {
    const { data } = await adminApiClient.get('/admin/me')
    return data.data
  },

  async updateMe(payload) {
    const { data } = await adminApiClient.patch('/admin/me', payload)
    return data.data
  },

  async fetchDashboard() {
    const { data } = await adminApiClient.get('/admin/dashboard')
    return data.data
  },

  async fetchProducts() {
    const { data } = await adminApiClient.get('/products')
    return (data.data || []).map(enrichProductMedia)
  },

  async createProduct(payload) {
    const body = buildUploadPayload(payload)
    const { data } = await adminApiClient.post('/products', body, {
      timeout: payload?.imageFile ? 30000 : undefined,
    })
    return enrichProductMedia(data.data)
  },

  async updateProduct(id, payload) {
    const body = buildUploadPayload(payload)
    const { data } = await adminApiClient.patch(`/products/${id}`, body, {
      timeout: payload?.imageFile ? 30000 : undefined,
    })
    return enrichProductMedia(data.data)
  },

  async deleteProduct(id) {
    await adminApiClient.delete(`/products/${id}`)
    return id
  },

  async fetchCategories() {
    const { data } = await adminApiClient.get('/categories')
    return (data.data || []).map(enrichCategoryMedia)
  },

  async createCategory(payload) {
    const body = buildUploadPayload(payload)
    const { data } = await adminApiClient.post('/categories', body, {
      timeout: payload?.imageFile ? 30000 : undefined,
    })
    return enrichCategoryMedia(data.data)
  },

  async updateCategory(id, payload) {
    const body = buildUploadPayload(payload)
    const { data } = await adminApiClient.patch(`/categories/${id}`, body, {
      timeout: payload?.imageFile ? 30000 : undefined,
    })
    return enrichCategoryMedia(data.data)
  },

  async deleteCategory(id) {
    await adminApiClient.delete(`/categories/${id}`)
    return id
  },

  async fetchOrders() {
    const { data } = await adminApiClient.get('/admin/orders')
    return data.data || []
  },

  async fetchOrderById(orderId) {
    const { data } = await adminApiClient.get(`/admin/orders/${orderId}`)
    return data.data
  },

  async updateOrderStatus(orderId, status) {
    const { data } = await adminApiClient.patch(
      `/admin/orders/${orderId}/status`,
      { status },
    )
    return data.data
  },

  async resendOrderReceipt(orderId) {
    const { data } = await adminApiClient.post(
      `/admin/orders/${orderId}/resend-receipt`,
      {},
      { timeout: 20000 },
    )
    return data
  },

  async fetchReviews() {
    const { data } = await adminApiClient.get('/admin/reviews')
    return (data.data || []).map(enrichReviewMedia)
  },

  async updateReviewStatus(reviewId, status) {
    const { data } = await adminApiClient.patch(
      `/admin/reviews/${reviewId}/status`,
      { status },
    )
    return enrichReviewMedia(data.data)
  },

  async deleteReview(reviewId) {
    await adminApiClient.delete(`/admin/reviews/${reviewId}`)
    return reviewId
  },

  async fetchSettings() {
    const { data } = await adminApiClient.get('/settings')
    return enrichSiteSettingsMedia(data.data)
  },

  async updateSettings(payload) {
    const body = buildUploadPayload(payload)
    const hasFiles = Boolean(
      payload?.heroImageFile || payload?.philosophyImageFile,
    )
    const { data } = await adminApiClient.patch('/settings', body, {
      timeout: hasFiles ? 30000 : undefined,
    })
    return enrichSiteSettingsMedia(data.data)
  },
}

