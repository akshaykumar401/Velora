import { useCallback, useEffect, useMemo, useState } from 'react'
import { CATEGORIES, PRODUCTS } from '../../data/catalogData.js'
import {
  ADMIN_DEMO_CREDENTIALS,
  DEFAULT_ADMIN_ORDERS,
  DEFAULT_ADMIN_PROFILE,
  DEFAULT_REVIEWS,
} from '../../data/adminData.js'
import { AdminContext } from './adminContext.js'

const SESSION_KEY = 'velora_admin_session'
const PROFILE_KEY = 'velora_admin_profile'
const PRODUCTS_KEY = 'velora_admin_products'
const CATEGORIES_KEY = 'velora_admin_categories'
const ORDERS_KEY = 'velora_admin_orders'
const REVIEWS_KEY = 'velora_admin_reviews'

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
    // Ignore storage errors in restricted environments
  }
}

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    readStorage(SESSION_KEY, false),
  )
  const [adminProfile, setAdminProfile] = useState(() =>
    readStorage(PROFILE_KEY, DEFAULT_ADMIN_PROFILE),
  )
  const [products, setProducts] = useState(() =>
    readStorage(PRODUCTS_KEY, PRODUCTS),
  )
  const [categories, setCategories] = useState(() =>
    readStorage(CATEGORIES_KEY, CATEGORIES),
  )
  const [orders, setOrders] = useState(() =>
    readStorage(ORDERS_KEY, DEFAULT_ADMIN_ORDERS),
  )
  const [reviews, setReviews] = useState(() =>
    readStorage(REVIEWS_KEY, DEFAULT_REVIEWS),
  )

  useEffect(() => writeStorage(SESSION_KEY, isAuthenticated), [isAuthenticated])
  useEffect(() => writeStorage(PROFILE_KEY, adminProfile), [adminProfile])
  useEffect(() => writeStorage(PRODUCTS_KEY, products), [products])
  useEffect(() => writeStorage(CATEGORIES_KEY, categories), [categories])
  useEffect(() => writeStorage(ORDERS_KEY, orders), [orders])
  useEffect(() => writeStorage(REVIEWS_KEY, reviews), [reviews])

  const loginAdmin = useCallback(({ email, passcode }) => {
    const normalizedEmail = email.trim().toLowerCase()
    const expectedEmail = ADMIN_DEMO_CREDENTIALS.email.toLowerCase()

    if (
      normalizedEmail === expectedEmail &&
      passcode === ADMIN_DEMO_CREDENTIALS.passcode
    ) {
      setIsAuthenticated(true)
      return { ok: true }
    }

    return {
      ok: false,
      error: 'Invalid administrator email or passcode.',
    }
  }, [])

  const logoutAdmin = useCallback(() => {
    setIsAuthenticated(false)
  }, [])

  const updateAdminProfile = useCallback((patch) => {
    setAdminProfile((prev) => ({ ...prev, ...patch }))
  }, [])

  const addProduct = useCallback((productInput) => {
    const slug =
      productInput.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Date.now().toString().slice(-4)

    const newProduct = {
      id: slug,
      to: `/product/${slug}`,
      featuredOrder: 0,
      image: productInput.image || null,
      placeholderTone:
        productInput.placeholderTone ||
        'bg-gradient-to-b from-[#EDE7DD] to-[#E2DACD]',
      ...productInput,
    }
    setProducts((prev) => [newProduct, ...prev])
    return newProduct
  }, [])

  const updateProduct = useCallback((id, patch) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    )
  }, [])

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const addCategory = useCallback((categoryInput) => {
    const slug =
      categoryInput.slug ||
      categoryInput.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    const newCategory = {
      id: `${slug}-${Date.now().toString().slice(-3)}`,
      slug,
      itemCount: 0,
      featured: Boolean(categoryInput.featured),
      to: `/shop?category=${slug}`,
      image: categoryInput.image || null,
      ...categoryInput,
    }
    setCategories((prev) => [...prev, newCategory])
    return newCategory
  }, [])

  const deleteCategory = useCallback((id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id))
  }, [])

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    )
  }, [])

  const getAdminOrderById = useCallback(
    (orderId) => orders.find((order) => order.id === orderId),
    [orders],
  )

  const updateReviewStatus = useCallback((reviewId, status) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId ? { ...review, status } : review,
      ),
    )
  }, [])

  const deleteReview = useCallback((reviewId) => {
    setReviews((prev) => prev.filter((review) => review.id !== reviewId))
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated,
      adminProfile,
      products,
      categories,
      orders,
      reviews,
      loginAdmin,
      logoutAdmin,
      updateAdminProfile,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      deleteCategory,
      updateOrderStatus,
      getAdminOrderById,
      updateReviewStatus,
      deleteReview,
    }),
    [
      isAuthenticated,
      adminProfile,
      products,
      categories,
      orders,
      reviews,
      loginAdmin,
      logoutAdmin,
      updateAdminProfile,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      deleteCategory,
      updateOrderStatus,
      getAdminOrderById,
      updateReviewStatus,
      deleteReview,
    ],
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

