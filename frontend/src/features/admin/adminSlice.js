import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { adminApi } from '../../services/adminApi.js'

const DEFAULT_ADMIN_PROFILE = {
  name: 'Atelier Administrator',
  role: 'Atelier Director',
  email: '',
  studio: '',
  phone: '',
}

const ADMIN_TOKEN_KEY = 'velora_admin_token'

const isAdminSessionError = (message = '') => {
  const lower = String(message).toLowerCase()
  return (
    lower.includes('unauthorized') ||
    lower.includes('expired') ||
    lower.includes('invalid administrator') ||
    lower.includes('administrator authentication') ||
    lower.includes('privileges required') ||
    lower.includes('not authorized')
  )
}

const readStoredToken = () => {
  try {
    return window.localStorage.getItem(ADMIN_TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

const persistToken = (token) => {
  try {
    if (token) window.localStorage.setItem(ADMIN_TOKEN_KEY, token)
    else window.localStorage.removeItem(ADMIN_TOKEN_KEY)
  } catch {
    // Ignore storage restriction
  }
}

export const adminLoginThunk = createAsyncThunk(
  'admin/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const result = await adminApi.login(credentials)
      persistToken(result.accessToken)
      return result
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const adminLogoutThunk = createAsyncThunk('admin/logout', async () => {
  try {
    await adminApi.logout()
  } catch {
    // Clear local session regardless of network
  } finally {
    persistToken('')
  }
})

export const bootstrapAdminThunk = createAsyncThunk(
  'admin/bootstrap',
  async (_, { rejectWithValue }) => {
    try {
      const [
        adminProfile,
        products,
        categories,
        orders,
        reviews,
        siteSettings,
      ] = await Promise.all([
        adminApi.fetchMe(),
        adminApi.fetchProducts(),
        adminApi.fetchCategories(),
        adminApi.fetchOrders(),
        adminApi.fetchReviews(),
        adminApi.fetchSettings().catch(() => null),
      ])
      return {
        adminProfile,
        products,
        categories,
        orders,
        reviews,
        siteSettings,
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
  {
    condition: (_, { getState }) => {
      const { admin } = getState()
      return !admin.bootstrapping && !admin.bootstrapped
    },
  },
)

export const updateAdminMeThunk = createAsyncThunk(
  'admin/updateMe',
  async (payload, { rejectWithValue }) => {
    try {
      return await adminApi.updateMe(payload)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const createAdminProductThunk = createAsyncThunk(
  'admin/createProduct',
  async (payload, { rejectWithValue }) => {
    try {
      return await adminApi.createProduct(payload)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const updateAdminProductThunk = createAsyncThunk(
  'admin/updateProduct',
  async ({ id, patch }, { rejectWithValue }) => {
    try {
      return await adminApi.updateProduct(id, patch)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const deleteAdminProductThunk = createAsyncThunk(
  'admin/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      return await adminApi.deleteProduct(id)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const createAdminCategoryThunk = createAsyncThunk(
  'admin/createCategory',
  async (payload, { rejectWithValue }) => {
    try {
      return await adminApi.createCategory(payload)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const updateAdminCategoryThunk = createAsyncThunk(
  'admin/updateCategory',
  async ({ id, patch }, { rejectWithValue }) => {
    try {
      return await adminApi.updateCategory(id, patch)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const deleteAdminCategoryThunk = createAsyncThunk(
  'admin/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      return await adminApi.deleteCategory(id)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const updateAdminOrderStatusThunk = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      return await adminApi.updateOrderStatus(orderId, status)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const fetchAdminReviewsThunk = createAsyncThunk(
  'admin/fetchReviews',
  async (_, { rejectWithValue }) => {
    try {
      return await adminApi.fetchReviews()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const updateAdminReviewStatusThunk = createAsyncThunk(
  'admin/updateReviewStatus',
  async ({ reviewId, status }, { rejectWithValue }) => {
    try {
      return await adminApi.updateReviewStatus(reviewId, status)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const deleteAdminReviewThunk = createAsyncThunk(
  'admin/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      return await adminApi.deleteReview(reviewId)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const updateAdminSettingsThunk = createAsyncThunk(
  'admin/updateSettings',
  async (payload, { rejectWithValue }) => {
    try {
      return await adminApi.updateSettings(payload)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

const initialToken = readStoredToken()

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    accessToken: initialToken,
    isAuthenticated: Boolean(initialToken),
    bootstrapping: false,
    bootstrapped: false,
    loading: false,
    error: null,
    adminProfile: DEFAULT_ADMIN_PROFILE,
    products: [],
    categories: [],
    orders: [],
    reviews: [],
    siteSettings: null,
  },
  reducers: {
    clearAdminError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLoginThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(adminLoginThunk.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.accessToken = action.payload.accessToken
        state.adminProfile = action.payload.admin
      })
      .addCase(adminLoginThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(adminLogoutThunk.fulfilled, (state) => {
        state.isAuthenticated = false
        state.accessToken = ''
        state.bootstrapping = false
        state.bootstrapped = false
        state.products = []
        state.categories = []
        state.orders = []
        state.reviews = []
        state.siteSettings = null
      })
      .addCase(bootstrapAdminThunk.pending, (state) => {
        state.bootstrapping = true
      })
      .addCase(bootstrapAdminThunk.fulfilled, (state, action) => {
        state.bootstrapping = false
        state.bootstrapped = true
        state.adminProfile = action.payload.adminProfile
        state.products = action.payload.products || []
        state.categories = action.payload.categories || []
        state.orders = action.payload.orders || []
        state.reviews = action.payload.reviews || []
        state.siteSettings = action.payload.siteSettings || null
      })
      .addCase(bootstrapAdminThunk.rejected, (state, action) => {
        state.bootstrapping = false
        if (isAdminSessionError(action.payload)) {
          state.isAuthenticated = false
          state.accessToken = ''
          persistToken('')
        }
      })
      .addCase(updateAdminMeThunk.fulfilled, (state, action) => {
        state.adminProfile = action.payload
      })
      .addCase(updateAdminMeThunk.rejected, (state, action) => {
        if (isAdminSessionError(action.payload)) {
          state.isAuthenticated = false
          state.accessToken = ''
          persistToken('')
        }
      })
      .addCase(createAdminProductThunk.fulfilled, (state, action) => {
        state.products = [action.payload, ...state.products]
      })
      .addCase(updateAdminProductThunk.fulfilled, (state, action) => {
        state.products = state.products.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        )
      })
      .addCase(deleteAdminProductThunk.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (item) => item.id !== action.payload,
        )
      })
      .addCase(createAdminCategoryThunk.fulfilled, (state, action) => {
        state.categories = [...state.categories, action.payload]
      })
      .addCase(updateAdminCategoryThunk.fulfilled, (state, action) => {
        const previousId = action.meta.arg?.id
        state.categories = state.categories.map((cat) =>
          cat.id === previousId || cat._id === action.payload._id
            ? action.payload
            : cat,
        )
      })
      .addCase(deleteAdminCategoryThunk.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (cat) => cat.id !== action.payload,
        )
      })
      .addCase(updateAdminOrderStatusThunk.fulfilled, (state, action) => {
        state.orders = state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order,
        )
      })
      .addCase(fetchAdminReviewsThunk.fulfilled, (state, action) => {
        state.reviews = action.payload || []
      })
      .addCase(updateAdminReviewStatusThunk.fulfilled, (state, action) => {
        state.reviews = state.reviews.map((review) =>
          review.id === action.payload.id ? action.payload : review,
        )
      })
      .addCase(deleteAdminReviewThunk.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(
          (review) => review.id !== action.payload,
        )
      })
      .addCase(updateAdminSettingsThunk.fulfilled, (state, action) => {
        state.siteSettings = action.payload
      })
  },
})

export const { clearAdminError } = adminSlice.actions
export default adminSlice.reducer
