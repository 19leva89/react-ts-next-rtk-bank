'use client'

import { Provider } from 'react-redux'
import { PropsWithChildren, useRef } from 'react'

import { makeStore, AppStore } from '@/lib/store'

export default function StoreProvider({ children }: PropsWithChildren) {
	const storeRef = useRef<AppStore>(undefined)

	if (!storeRef.current) {
		// Create the store instance the first time this renders
		storeRef.current = makeStore()
	}

	return <Provider store={storeRef.current}>{children}</Provider>
}
