import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
	async rewrites() {
		return [
			{
				source: "/api/:path*", // Proxy API requests
				destination: "http://localhost:8787/:path*", // Backend server
			},
		];
	},
};

export default withFlowbiteReact(nextConfig);
