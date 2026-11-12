import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { HERO_DATA, PHILOSOPHY_DATA } from '../../data/editorialData.js'
import { catalogApi } from '../../services/catalogApi.js'

const INITIAL_SITE_SETTINGS = {
  heroImage: HERO_DATA.image,
  heroEyebrow: HERO_DATA.eyebrow,
  heroTitle: HERO_DATA.title,
  heroSubtitle: HERO_DATA.subtitle,
  philosophyImage: PHILOSOPHY_DATA.image,
  isHeroCustomized: false,
}

export const fetchCatalog = createAsyncThunk(
  'catalog/fetchCatalog',
  async (params = {}, { rejectWithValue }) => {
    try {
      const [categories, products, siteSettings] = await Promise.all([
        catalogApi.fetchCategories(),
        catalogApi.fetchProducts(params),
        catalogApi.fetchSiteSettings().catch(() => null),
      ])
      return { categories, products, siteSettings }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const fetchProductDetail = createAsyncThunk(
  'catalog/fetchProductDetail',
  async (idOrSlug, { rejectWithValue }) => {
    try {
      return await catalogApi.fetchProductDetail(idOrSlug)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const submitProductReview = createAsyncThunk(
  'catalog/submitProductReview',
  async ({ productSlug, rating, comment }, { rejectWithValue }) => {
    try {
      return await catalogApi.submitReview(productSlug, { rating, comment })
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

const catalogSlice = createSlice({
  name: 'catalog',
  initialState: {
    categories: [],
    products: [],
    siteSettings: INITIAL_SITE_SETTINGS,
    activeProduct: null,
    activeReviews: [],
    relatedProducts: [],
    status: 'idle',
    detailStatus: 'idle',
    reviewSubmitStatus: 'idle',
    error: null,
  },
  reducers: {
    clearActiveProduct(state) {
      state.activeProduct = null
      state.activeReviews = []
      state.relatedProducts = []
      state.detailStatus = 'idle'
      state.reviewSubmitStatus = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalog.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.categories = action.payload.categories || []
        state.products = action.payload.products || []
        if (action.payload.siteSettings) {
          state.siteSettings = action.payload.siteSettings
        }
      })
      .addCase(fetchCatalog.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(fetchProductDetail.pending, (state) => {
        state.detailStatus = 'loading'
        state.activeProduct = null
        state.activeReviews = []
        state.relatedProducts = []
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded'
        state.activeProduct = action.payload.product || null
        state.activeReviews = action.payload.reviews || []
        state.relatedProducts = action.payload.relatedProducts || []
      })
      .addCase(fetchProductDetail.rejected, (state) => {
        state.detailStatus = 'failed'
        state.activeProduct = null
        state.activeReviews = []
        state.relatedProducts = []
      })
      .addCase(submitProductReview.pending, (state) => {
        state.reviewSubmitStatus = 'loading'
      })
      .addCase(submitProductReview.fulfilled, (state, action) => {
        state.reviewSubmitStatus = 'succeeded'
        if (
          action.payload &&
          (!state.activeProduct ||
            action.payload.productId === state.activeProduct.id)
        ) {
          const exists = state.activeReviews.some(
            (r) => r.id === action.payload.id,
          )
          if (!exists) {
            state.activeReviews = [action.payload, ...state.activeReviews]
          }
        }
      })
      .addCase(submitProductReview.rejected, (state) => {
        state.reviewSubmitStatus = 'failed'
      })
  },
})

export const { clearActiveProduct } = catalogSlice.actions
export default catalogSlice.reducer
