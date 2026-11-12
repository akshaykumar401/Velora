import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const API_ORIGIN = /^https?:\/\//i.test(API_BASE_URL)
  ? API_BASE_URL.replace(/\/api\/v\d+\/?$/, '')
  : ''

export const resolveMediaUrl = (url) => {
  if (!url) return null
  if (/^(https?:|data:|blob:)/i.test(url)) return url
  if (url.startsWith('/uploads/') && API_ORIGIN) {
    return `${API_ORIGIN}${url}`
  }
  return url
}

let getCustomerToken = null
let getAdminToken = null

export const setCustomerTokenGetter = (fn) => {
  getCustomerToken = fn
}

export const setAdminTokenGetter = (fn) => {
  getAdminToken = fn
}

const createInstance = (tokenGetterResolver) => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    timeout: 12000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  instance.interceptors.request.use(async (config) => {
    if (config.data instanceof FormData) {
      if (typeof config.headers?.delete === 'function') {
        config.headers.delete('Content-Type')
      } else if (config.headers) {
        delete config.headers['Content-Type']
      }
    }
    const getter = tokenGetterResolver()
    if (typeof getter === 'function') {
      const token = await getter()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Unexpected network error'
      return Promise.reject(new Error(message))
    },
  )

  return instance
}

export const apiClient = createInstance(() => getCustomerToken)
export const adminApiClient = createInstance(() => getAdminToken)

export const enrichProductMedia = (product) => {
  if (!product) return product
  const key = product.slug || product.id
  return {
    ...product,
    id: key,
    image: resolveMediaUrl(product.image) || null,
    to: `/product/${key}`,
  }
}

export const enrichCategoryMedia = (category) => {
  if (!category) return category
  const key = category.slug || category.id
  return {
    ...category,
    id: key,
    image: resolveMediaUrl(category.image) || null,
    to: `/shop?category=${key}`,
  }
}

export const enrichSiteSettingsMedia = (settings) => {
  if (!settings) return settings
  return {
    ...settings,
    heroImage: resolveMediaUrl(settings.heroImage),
    philosophyImage: resolveMediaUrl(settings.philosophyImage),
  }
}

