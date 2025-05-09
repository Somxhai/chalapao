import React from "react";

import Header from "@/components/Header/lender";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<Header>
				<></>
			</Header>
			<main className="container mx-auto px-16 py-8">{children}</main>
		</div>
	);
}
