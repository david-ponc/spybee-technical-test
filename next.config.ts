import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	experimental: {
		serverActions: {
			bodySizeLimit: '20mb',
		},
	},
	redirects: async () => {
		return [
			{
				source: '/',
				destination: '/incidentes',
				permanent: true,
			},
		];
	},
};

export default nextConfig;
