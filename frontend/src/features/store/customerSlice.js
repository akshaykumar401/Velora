import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { customerApi } from '../../services/customerApi.js'

const DEFAULT_PROFILE = {
  fullName: '',
  email: '',
  phone: '',
  preferredSize: 'M',
  newsletterOptIn: true,
}

export const syncCustomerSession = createAsyncThunk(
  'customer/syncSession',
  async (seed = {}, { rejectWithValue }) => {
    try {
      const [user, orders] = await Promise.all([
        customerApi.syncSession(seed),
        customerApi.fetchMyOrders(),
      ])
      return { user, orders }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const updateCustomerProfile = createAsyncThunk(
  'customer/updateProfile',
  async (payload, { rejectWithValue }) => {
    try {
      return await customerApi.updateProfile(payload)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const addCustomerAddress = createAsyncThunk(
  'customer/addAddress',
  async (payload, { rejectWithValue }) => {
    try {
      return await customerApi.addAddress(payload)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const editCustomerAddress = createAsyncThunk(
  'customer/editAddress',
  async ({ addressId, payload }, { rejectWithValue }) => {
    try {
      return await customerApi.updateAddress(addressId, payload)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const removeCustomerAddress = createAsyncThunk(
  'customer/removeAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      return await customerApi.deleteAddress(addressId)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const makeDefaultCustomerAddress = createAsyncThunk(
  'customer/setDefaultAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      return await customerApi.setDefaultAddress(addressId)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const toggleCustomerWishlist = createAsyncThunk(
  'customer/toggleWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      return await customerApi.toggleWishlist(productId)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const addCustomerCartItem = createAsyncThunk(
  'customer/addCartItem',
  async (payload, { rejectWithValue }) => {
    try {
      return await customerApi.addToCart(payload)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const updateCustomerCartQty = createAsyncThunk(
  'customer/updateCartQty',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      return await customerApi.updateCartItem(itemId, quantity)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const removeCustomerCartItem = createAsyncThunk(
  'customer/removeCartItem',
  async (itemId, { rejectWithValue }) => {
    try {
      return await customerApi.removeCartItem(itemId)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const clearCustomerCart = createAsyncThunk(
  'customer/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      return await customerApi.clearCart()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const placeCustomerOrder = createAsyncThunk(
  'customer/placeOrder',
  async (payload, { rejectWithValue }) => {
    try {
      return await customerApi.verifyRazorpayPayment(payload)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

const initialState = {
  synced: false,
  loading: false,
  error: null,
  profile: DEFAULT_PROFILE,
  addresses: [],
  wishlistIds: [],
  cartItems: [],
  orders: [],
}

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    resetCustomerState() {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncCustomerSession.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(syncCustomerSession.fulfilled, (state, action) => {
        state.loading = false
        state.synced = true
        const { user, orders } = action.payload
        if (user) {
          state.profile = {
            fullName: user.fullName || DEFAULT_PROFILE.fullName,
            email: user.email || DEFAULT_PROFILE.email,
            phone: user.phone || '',
            preferredSize: user.preferredSize || 'M',
            newsletterOptIn: Boolean(user.newsletterOptIn),
          }
          state.addresses = user.addresses || []
          state.wishlistIds = user.wishlistIds || []
          state.cartItems = user.cartItems || []
        }
        state.orders = orders || []
      })
      .addCase(syncCustomerSession.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateCustomerProfile.fulfilled, (state, action) => {
        const user = action.payload
        state.profile = {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          preferredSize: user.preferredSize,
          newsletterOptIn: Boolean(user.newsletterOptIn),
        }
      })
      .addCase(addCustomerAddress.fulfilled, (state, action) => {
        state.addresses = action.payload
      })
      .addCase(editCustomerAddress.fulfilled, (state, action) => {
        state.addresses = action.payload
      })
      .addCase(removeCustomerAddress.fulfilled, (state, action) => {
        state.addresses = action.payload
      })
      .addCase(makeDefaultCustomerAddress.fulfilled, (state, action) => {
        state.addresses = action.payload
      })
      .addCase(toggleCustomerWishlist.fulfilled, (state, action) => {
        state.wishlistIds = action.payload
      })
      .addCase(addCustomerCartItem.fulfilled, (state, action) => {
        state.cartItems = action.payload
      })
      .addCase(updateCustomerCartQty.fulfilled, (state, action) => {
        state.cartItems = action.payload
      })
      .addCase(removeCustomerCartItem.fulfilled, (state, action) => {
        state.cartItems = action.payload
      })
      .addCase(clearCustomerCart.fulfilled, (state) => {
        state.cartItems = []
      })
      .addCase(placeCustomerOrder.fulfilled, (state, action) => {
        state.orders = [action.payload, ...state.orders]
        state.cartItems = []
      })
  },
})

export const { resetCustomerState } = customerSlice.actions
export default customerSlice.reducer

