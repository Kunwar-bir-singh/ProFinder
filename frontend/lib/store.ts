import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { api } from './api/api'
import authReducer from './slices/authSlice'
import { setStoreReference } from './utils/auth-utils'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

// Enable listener behavior for the store
setupListeners(store.dispatch)

setStoreReference(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
