import { configureStore } from '@reduxjs/toolkit'
import catalogReducer from '../features/catalog/catalogSlice.js'
import customerReducer from '../features/store/customerSlice.js'
import adminReducer from '../features/admin/adminSlice.js'
import { setAdminTokenGetter } from '../services/apiClient.js'

export const store = configureStore({
  reducer: {
    catalog: catalogReducer,
    customer: customerReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: [
          'meta.arg.imageFile',
          'meta.arg.patch.imageFile',
          'meta.arg.heroImageFile',
          'meta.arg.philosophyImageFile',
        ],
      },
    }),
})

setAdminTokenGetter(() => store.getState().admin.accessToken)

