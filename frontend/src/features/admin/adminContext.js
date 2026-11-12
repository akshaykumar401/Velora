import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../App/hooks.js'
import { fetchCatalog } from '../catalog/catalogSlice.js'
import {
  adminLoginThunk,
  adminLogoutThunk,
  bootstrapAdminThunk,
  createAdminCategoryThunk,
  createAdminProductThunk,
  deleteAdminCategoryThunk,
  deleteAdminProductThunk,
  deleteAdminReviewThunk,
  fetchAdminReviewsThunk,
  updateAdminCategoryThunk,
  updateAdminMeThunk,
  updateAdminOrderStatusThunk,
  updateAdminProductThunk,
  updateAdminReviewStatusThunk,
  updateAdminSettingsThunk,
} from './adminSlice.js'

export const useAdmin = () => {
  const dispatch = useAppDispatch()
  const admin = useAppSelector((state) => state.admin)

  const loginAdmin = useCallback(
    async (credentials) => {
      try {
        await dispatch(adminLoginThunk(credentials)).unwrap()
        await dispatch(bootstrapAdminThunk())
        return { ok: true }
      } catch (error) {
        return { ok: false, error: error || 'Invalid administrator credentials' }
      }
    },
    [dispatch],
  )

  const logoutAdmin = useCallback(
    () => dispatch(adminLogoutThunk()),
    [dispatch],
  )

  const updateAdminProfile = useCallback(
    (payload) => dispatch(updateAdminMeThunk(payload)).unwrap(),
    [dispatch],
  )

  const addProduct = useCallback(
    async (payload) => {
      const created = await dispatch(createAdminProductThunk(payload)).unwrap()
      dispatch(fetchCatalog())
      return created
    },
    [dispatch],
  )

  const updateProduct = useCallback(
    async (id, patch) => {
      const result = await dispatch(updateAdminProductThunk({ id, patch }))
      if (updateAdminProductThunk.fulfilled.match(result)) {
        dispatch(fetchCatalog())
      }
      return result
    },
    [dispatch],
  )

  const deleteProduct = useCallback(
    async (id) => {
      const result = await dispatch(deleteAdminProductThunk(id))
      if (deleteAdminProductThunk.fulfilled.match(result)) {
        dispatch(fetchCatalog())
      }
      return result
    },
    [dispatch],
  )

  const addCategory = useCallback(
    async (payload) => {
      const created = await dispatch(createAdminCategoryThunk(payload)).unwrap()
      dispatch(fetchCatalog())
      return created
    },
    [dispatch],
  )

  const updateCategory = useCallback(
    async (id, patch) => {
      const updated = await dispatch(
        updateAdminCategoryThunk({ id, patch }),
      ).unwrap()
      dispatch(fetchCatalog())
      return updated
    },
    [dispatch],
  )

  const deleteCategory = useCallback(
    async (id) => {
      const result = await dispatch(deleteAdminCategoryThunk(id))
      if (deleteAdminCategoryThunk.fulfilled.match(result)) {
        dispatch(fetchCatalog())
      }
      return result
    },
    [dispatch],
  )

  const updateOrderStatus = useCallback(
    (orderId, status) =>
      dispatch(updateAdminOrderStatusThunk({ orderId, status })),
    [dispatch],
  )

  const getAdminOrderById = useCallback(
    (orderId) => admin.orders.find((order) => order.id === orderId),
    [admin.orders],
  )

  const refreshReviews = useCallback(
    () => dispatch(fetchAdminReviewsThunk()),
    [dispatch],
  )

  const updateReviewStatus = useCallback(
    async (reviewId, status) => {
      const result = await dispatch(
        updateAdminReviewStatusThunk({ reviewId, status }),
      )
      if (updateAdminReviewStatusThunk.fulfilled.match(result)) {
        dispatch(fetchCatalog())
      }
      return result
    },
    [dispatch],
  )

  const deleteReview = useCallback(
    async (reviewId) => {
      const result = await dispatch(deleteAdminReviewThunk(reviewId))
      if (deleteAdminReviewThunk.fulfilled.match(result)) {
        dispatch(fetchCatalog())
      }
      return result
    },
    [dispatch],
  )

  const updateSiteSettings = useCallback(
    async (payload) => {
      const updated = await dispatch(updateAdminSettingsThunk(payload)).unwrap()
      dispatch(fetchCatalog())
      return updated
    },
    [dispatch],
  )

  return {
    isAuthenticated: admin.isAuthenticated,
    loading: admin.loading,
    error: admin.error,
    adminProfile: admin.adminProfile,
    products: admin.products,
    categories: admin.categories,
    orders: admin.orders,
    reviews: admin.reviews,
    siteSettings: admin.siteSettings,
    loginAdmin,
    logoutAdmin,
    updateAdminProfile,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    updateOrderStatus,
    getAdminOrderById,
    refreshReviews,
    updateReviewStatus,
    deleteReview,
    updateSiteSettings,
  }
}
