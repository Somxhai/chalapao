"use client";

import {
	Navbar,
	NavbarBrand,
	NavbarCollapse,
	NavbarLink,
} from "flowbite-react";

import Brand from "./brand";
import Search from "./search";
import Menu from "./menu";

const Header = () => {
	const links = [
		{ href: "/", label: "Popular", active: true },
		{ href: "/listings", label: "Listings" },
		{ href: "/pricing", label: "Pricing" },
		{ href: "/renter-center", label: "Renter Center" },
		{ href: "/blog", label: "Blog" },
		{ href: "/careers", label: "Careers" },
		{ href: "/support", label: "Support" },
		{ href: "/about", label: "About" },
	];
	return (
		<Navbar>
			<div className="px-2 py-2.5 sm:px-4 rounded-lg border w-full flex justify-between">
				<NavbarBrand href="/">
					<Brand />
				</NavbarBrand>
				<div className="flex md:order-2 gap-6 md:gap-8 items-center w-7/12 justify-end">
					<Search />
					<Menu />
				</div>
			</div>
			<div className="flex items-center justify-between w-full">
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
			</div>
		</Navbar>
	);
};

export default Header;
