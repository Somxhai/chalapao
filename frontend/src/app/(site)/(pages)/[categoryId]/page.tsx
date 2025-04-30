"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import Sort from "@/components/Items/sort";
import ItemCard from "@/components/Items/item";

import Header from "@/components/Header";
import Links from "@/components/Header/links";

import { ItemType } from "@/types/item";

const Page = () => {
	const [items, setItems] = useState<ItemType[]>([]);

	const { categoryId } = useParams();

	useEffect(() => {
		const fetchItems = async () => {
			try {
				const response = await fetch(
					`/api/item/category/${categoryId}`
				);
				const data = await response.json();
				setItems(data);
				console.log("Fetched categories:", data);
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
					<Sort />
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
