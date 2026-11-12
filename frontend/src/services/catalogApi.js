import {
  apiClient,
  enrichCategoryMedia,
  enrichProductMedia,
  enrichSiteSettingsMedia,
} from './apiClient.js'

export const catalogApi = {
  async fetchCategories() {
    const { data } = await apiClient.get('/categories')
    return (data.data || []).map(enrichCategoryMedia)
  },

  async fetchProducts(params = {}) {
    const { data } = await apiClient.get('/products', { params })
    return (data.data || []).map(enrichProductMedia)
  },

  async fetchProductDetail(idOrSlug) {
    const { data } = await apiClient.get(`/products/${idOrSlug}`)
    const payload = data.data || {}
    return {
      product: enrichProductMedia(payload.product),
      reviews: payload.reviews || [],
      relatedProducts: (payload.relatedProducts || []).map(enrichProductMedia),
    }
  },

  async submitReview(productSlug, reviewPayload) {
    const { data } = await apiClient.post(
      `/reviews/product/${productSlug}`,
      reviewPayload,
    )
    return data.data
  },

  async subscribeNewsletter(email, source = 'footer') {
    const { data } = await apiClient.post('/newsletter/subscribe', {
      email,
      source,
    })
    return data.data
  },

  async submitContactInquiry(payload) {
    const { data } = await apiClient.post('/mail/contact', payload, {
      timeout: 20000,
    })
    return data
  },

  async fetchSiteSettings() {
    const { data } = await apiClient.get('/settings')
    return enrichSiteSettingsMedia(data.data)
  },
}

