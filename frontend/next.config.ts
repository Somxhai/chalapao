import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
	async rewrites() {
		const backendUrl = process.env.BACKEND_URL || "http://backend:8787";
		return [
			{
				source: "/api/:path((?!auth).*)", // Proxy API requests except /auth
				destination: `${backendUrl}/:path*`, // Backend server
			},
		];
	},
	eslint: {
		ignoreDuringBuilds: true, // Ignore ESLint errors during build
	},
	/* config options here */
	output: "standalone",
};

export default withFlowbiteReact(nextConfig);
