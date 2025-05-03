"use client";

import { Dropdown, DropdownItem } from "flowbite-react";
import { ItemType } from "@/types/item";

const Sort = () => {
	return (
		<Dropdown label="Sort by" inline>
			<DropdownItem>Name</DropdownItem>
			<DropdownItem>Price (Low to High)</DropdownItem>
			<DropdownItem>Price (High to Low)</DropdownItem>
			<DropdownItem>Newest</DropdownItem>
		</Dropdown>
	);
};

export default Sort;
