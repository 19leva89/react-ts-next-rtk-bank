import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'

import { RootState } from '@/lib/store'
import { BASE_URL } from '@/utils/constants'

const baseQuery = fetchBaseQuery({
	baseUrl: `${BASE_URL}/api`,
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).auth.user?.token || localStorage.getItem('token')

		if (token && token !== null) {
			headers.set('authorization', `Bearer ${token}`)
		}
	},
})

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 0 })

export const api = createApi({
	reducerPath: 'splitApi',
	baseQuery: baseQueryWithRetry,
	refetchOnMountOrArgChange: true,
	endpoints: () => ({}),
})
