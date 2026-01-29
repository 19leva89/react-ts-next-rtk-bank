import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'gravatar.com',
			},
		],
		unoptimized: true,
	},
	reactCompiler: true,
	reactStrictMode: false,
}

export default nextConfig