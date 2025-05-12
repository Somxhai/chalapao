"use client";

import { Navbar, NavbarBrand } from "flowbite-react";

import Brand from "./brand";
import Search from "./search";
import Menu from "./menu";

import { ReactNode } from "react";

interface HeaderProps {
	children: ReactNode;
}

const Header = ({ children }: HeaderProps) => {
	return (
		<Navbar>
			<div className="px-2 py-2.5 sm:px-4 rounded-lg border w-full flex justify-between">
				<NavbarBrand href="/">
					<Brand />
				</NavbarBrand>
				<div className="flex md:order-2 gap-6 md:gap-8 items-center w-full xl:w-7/12 ms-6 justify-end">
					<Search />
					<Menu />
				</div>
			</div>
			<div className="flex items-center justify-between w-full">
				{children}
			</div>
		</Navbar>
	);
};

export default Header;
