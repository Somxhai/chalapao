"use client";

import { useState, useEffect } from "react";

import { useParams } from "next/navigation";

import { Dropdown, DropdownItem } from "flowbite-react";

import ItemCard from "@/components/Items/item";

import Header from "@/components/Header";
import Links from "@/components/Header/links";

const Page = () => {
	const [items, setItems] = useState<any[]>([]);

	const { categoryId } = useParams();

	useEffect(() => {
		const fetchItems = async () => {
			try {
				const response = await fetch(
					`/api/item/category/${categoryId}`
				);
				const data = await response.json();
				setItems(data);
			} catch (error) {
				console.error("Error fetching items:", error);
			}
		};

		fetchItems();
	}, []);

	return (
		<>
			<Header>
				<Links />
			</Header>
			<main className="container mx-auto px-16 py-8">
				<div className="flex justify-between mb-6">
					<h1 className="text-3xl font-bold">Items</h1>
					<Dropdown label="Sort by" inline>
						<DropdownItem>Name</DropdownItem>
						<DropdownItem>Price (Low to High)</DropdownItem>
						<DropdownItem>Price (High to Low)</DropdownItem>
					</Dropdown>
				</div>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{items.map((item) => (
						<ItemCard
							key={item.item.id}
							item={item.item}
							image={item.images[0]}
						/>
					))}
				</div>
			</main>
		</>
	);
};

export default Page;
