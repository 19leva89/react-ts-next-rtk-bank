import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

import { api } from '@/lib/services/api'
import auth from '@/features/auth/authSlice'
import { listenerMiddleware } from '@/listenerMiddleware'

export const makeStore = () => {
	return configureStore({
		reducer: {
			[api.reducerPath]: api.reducer,
			auth,
		},
		middleware: (getDefaultMiddleware) => {
			return getDefaultMiddleware().concat(api.middleware).prepend(listenerMiddleware.middleware)
		},

		// Adding support for Redux DevTools to track and analyze Redux state
		devTools: process.env.NODE_ENV !== 'production',
	})
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
