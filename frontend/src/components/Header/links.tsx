"use client";

import { NavbarCollapse, NavbarLink } from "flowbite-react";

const Links = () => {
	const links = [
		// { href: "/", label: "Popular", active: true },
		// { href: "/newest", label: "Newest" },
		{ href: "/auth/sign-in", label: "sign-in" },
		{ href: "/auth/sign-up", label: "sign-up" },
		{ href: "/auth/profile-info", label: "profile-info" },
		{ href: "/auth/verify-otp", label: "verify-otp" },
		{ href: "/item/99999999-9999-4999-b999-999999999999", label: "item" },
		{
			href: "/item/review/99999999-9999-4999-b999-999999999999",
			label: "item/review",
		},
		{ href: "/account", label: "account" },
		{ href: "/account/review/1111111111", label: "account/review" },
		{ href: "/rentals", label: "rentals" },
		{
			href: "/rental/1a2b3c4d-5e6f-7g8h-9i0j-1a2b3c4d5e6f",
			label: "rental",
		},
		{
			href: "/rental/confirm/99999999-9999-4999-b999-999999999999",
			label: "rental/confirm",
		},
		// { href: "/lender-center", label: "Lender Center" },
	];
	return (
		<NavbarCollapse className="md:mt-3 mx-auto">
			{links.map((link) => (
				<NavbarLink
					key={link.label}
					href={link.href}
					// active={link.active}
				>
					{link.label}
				</NavbarLink>
			))}
		</NavbarCollapse>
	);
};

export default Links;
