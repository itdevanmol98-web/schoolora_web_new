import { configureStore, combineReducers } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'

const rootReducer = combineReducers({
  auth: authReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export const createStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  })
}

export const store = createStore()

export type AppDispatch = typeof store.dispatch
