'use client'

import { PropsWithChildren } from 'react'
import { useRouter } from 'next/navigation'

import { Paths } from '@/constants/paths'
import { Loader } from '@/components/shared'
import { useCurrentQuery } from '@/lib/services/auth'

export const Auth = ({ children }: PropsWithChildren) => {
	const router = useRouter()
	const { isLoading, isError } = useCurrentQuery()

	if (isLoading) {
		return <Loader />
	}

	if (isError) {
		router.push(Paths.home)
	}

	return children
}
