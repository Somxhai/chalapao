import type { Metadata } from "next";

import { ThemeModeScript } from "flowbite-react";

import "@/app/css/globals.css";
import "@/app/css/styles.css";

export const metadata: Metadata = {
	title: "Chalapao",
	description: "A platform to rent and lend items easily and securely.",
};

const RootLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				suppressHydrationWarning
				className={`antialiased vsc-initialized bg-[#f0f0f0] text-gray-900 dark:bg-gray-900 dark:text-white`}
			>
				{children}
			</body>
		</html>
	);
};

export default RootLayout;
