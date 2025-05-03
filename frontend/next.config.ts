import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
	async rewrites() {
		return [
			{
				source: "/api/:path((?!auth).*)", // Proxy API requests except /auth
				destination: "http://localhost:8787/:path*", // Backend server
			},
		];
	},
};

export default withFlowbiteReact(nextConfig);
