import React from "react";

import Header from "@/components/Header";
import Links from "@/components/Header/links";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<Header>
				<Links />
			</Header>
			<main className="container mx-auto px-16 py-8">{children}</main>
		</div>
	);
}
