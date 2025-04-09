"use client";

import { NavbarCollapse, NavbarLink } from "flowbite-react";

const Links = () => {
	const links = [
		{ href: "/", label: "Popular", active: true },
		{ href: "/newest", label: "Newest" },
		{ href: "/pricing", label: "Pricing" },
		{ href: "/blog", label: "Blog" },
		{ href: "/careers", label: "Careers" },
		{ href: "/support", label: "Support" },
		{ href: "/about", label: "About" },
		{ href: "/lender-center", label: "Lender Center" },
	];
	return (
		<NavbarCollapse className="md:mt-3 mx-auto">
			{links.map((link) => (
				<NavbarLink
					key={link.label}
					href={link.href}
					active={link.active}
				>
					{link.label}
				</NavbarLink>
			))}
		</NavbarCollapse>
	);
};

export default Links;
