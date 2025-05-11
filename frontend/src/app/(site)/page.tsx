"use client";

import { useState, useEffect } from "react";
import { Dropdown, DropdownItem } from "flowbite-react";

import { ItemType } from "@/types/item";

import Header from "@/components/Header";
import Links from "@/components/Header/links";
import ItemCard from "@/components/Items/item";

const Page = () => {
	const [items, setItems] = useState<ItemType[]>([]);

	useEffect(() => {
		const fetchItems = async () => {
			try {
				const response = await fetch(`/api/item/all/items`);
				const data = await response.json();

				setItems(
					data.map((entry: any) => ({
						id: entry.item.id,
						owner_id: entry.item.owner_id,
						category_id: entry.item.category_id,
						item_name: entry.item.item_name,
						description: entry.item.description,
						rental_terms: entry.item.rental_terms,
						penalty_terms: entry.item.penalty_terms,
						item_status: entry.item.item_status,
						price_per_day: entry.item.price_per_day,
						created_at: entry.item.created_at,
						updated_at: entry.item.updated_at,
						images: entry.images,
						keywords: entry.item.keywords || [],
						item_reviews: entry.item.item_reviews || [],
						item_rating: entry.item.item_rating,
					}))
				);
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
						<ItemCard key={item.id} item={item} />
					))}
				</div>
			</main>
		</>
	);
};

export default Page;
