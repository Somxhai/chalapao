"use client";

import { Navbar, NavbarBrand } from "flowbite-react";

import Brand from "./brand";
import Search from "./search";
import Menu from "./menu";
import Links from "./links";

import { data as addresses } from "@/data/address";
import { data as categories } from "@/data/category";
import { data as items } from "@/data/item";
import { data as itemImages } from "@/data/item_image";
import { data as itemReviews } from "@/data/item_review";
import { data as itemReviewImages } from "@/data/item_review_image";
import { data as keywords } from "@/data/keyword";
import { data as payments } from "@/data/payment";
import { data as rentals } from "@/data/rental";
import { data as users } from "@/data/user";
import { data as userReviews } from "@/data/user_review";

const Header = () => {
	return (
		<Navbar>
			<div className="px-2 py-2.5 sm:px-4 rounded-lg border w-full flex justify-between">
				<NavbarBrand href="/">
					<Brand />
				</NavbarBrand>
				<div className="flex md:order-2 gap-6 md:gap-8 items-center w-full xl:w-7/12 ms-6 justify-end">
					<Search />
					<Menu user={users[0]} />
				</div>
			</div>
			<div className="flex items-center justify-between w-full">
				<Links />
			</div>
		</Navbar>
	);
};

export default Header;
