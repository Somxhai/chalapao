"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";

import { ItemType } from "@/types/item";

const Page = () => {
	const [items, setItems] = useState<ItemType[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [sortBy, setSortBy] = useState("Latest");
	const [selectedTab, setSelectedTab] = useState<
		"All" | "Rented" | "Available" | "Unavailable"
	>("All");

	const session = useSession();
	const userId = session?.data?.user.id;

	useEffect(() => {
		const fetchItems = async () => {
			try {
				const response = await fetch(`/api/item/user/${userId}`);
				if (!response.ok) throw new Error("Failed to fetch items");
				const data = await response.json();
				const dataItems: ItemType[] = data.map((item: any) => {
					return {
						...item.item,
						images: item.images,
					};
				});
				setItems(dataItems);
			} catch (error) {
				console.error("Error fetching items:", error);
			} finally {
				setLoading(false);
			}
		};

		if (userId) {
			fetchItems();
		}
	}, [userId]);

	const deleteItem = async (itemId: string) => {
		if (confirm("Are you sure you want to delete this item?")) {
			try {
				const response = await fetch(`/api/item/${itemId}`, {
					method: "DELETE",
				});
				if (!response.ok) throw new Error("Failed to delete item");
				setItems((prevItems) =>
					prevItems.filter((item) => item.id !== itemId)
				);
			} catch (error) {
				console.error("Error deleting item:", error);
			}
		}
	};

	const filterByTab = (item: ItemType) => {
		if (selectedTab === "All") return true;

		if (selectedTab === "Available")
			return item.item_status === "available";

		if (selectedTab === "Rented") return item.item_status === "rented";

		if (selectedTab === "Unavailable")
			return item.item_status === "unavailable";

		return true;
	};

	const filteredItems = items
		.filter(filterByTab)
		.filter((item) =>
			item.item_name.toLowerCase().includes(search.toLowerCase())
		)
		.sort((a, b) => {
			if (sortBy === "Latest") return 0;
			if (sortBy === "Rating")
				return (b.item_rating ?? 0) - (a.item_rating ?? 0);
			if (sortBy === "Price: Low to High")
				return a.price_per_day - b.price_per_day;
			if (sortBy === "Price: High to Low")
				return b.price_per_day - a.price_per_day;
			return 0;
		});

	if (loading) return <div className="text-center py-20">Loading...</div>;

	return (
		<div className="w-full max-w-5xl mx-auto px-6">
			<h1 className="text-2xl font-bold mb-6 text-black">
				Rental Item Management
			</h1>
			<div className="flex justify-between mb-5 text-sm font-medium border-gray-200">
				<div className="flex gap-10">
					<button
						onClick={() => setSelectedTab("All")}
						className={`pb-1 ${
							selectedTab === "All"
								? "border-b-2 border-black"
								: "text-gray-500 hover:text-black"
						}`}
					>
						All
					</button>
					<button
						onClick={() => setSelectedTab("Available")}
						className={`pb-1 ${
							selectedTab === "Available"
								? "border-b-2 border-black"
								: "text-gray-500 hover:text-black"
						}`}
					>
						Available
					</button>
					<button
						onClick={() => setSelectedTab("Rented")}
						className={`pb-1 ${
							selectedTab === "Rented"
								? "border-b-2 border-black"
								: "text-gray-500 hover:text-black"
						}`}
					>
						Rented
					</button>
					<button
						onClick={() => setSelectedTab("Unavailable")}
						className={`pb-1 ${
							selectedTab === "Unavailable"
								? "border-b-2 border-black"
								: "text-gray-500 hover:text-black"
						}`}
					>
						Unavailable
					</button>
				</div>
				<a
					href="/lender/item/create"
					className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-600"
				>
					Add New
				</a>
			</div>

			<div className="bg-white p-6 rounded-lg shadow-md w-full">
				<div className="flex justify-between items-center mb-4">
					<input
						type="text"
						placeholder="Search items..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="border border-gray-300 px-4 py-2 rounded-lg w-1/3"
					/>

					<div className="flex items-center gap-2 text-sm text-gray-600">
						<span>Sort by:</span>
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="bg-transparent outline-none font-medium cursor-pointer"
						>
							<option value="Latest">Latest</option>
							<option value="Rating">Rating</option>
							<option value="Price: Low to High">
								Price: Low to High
							</option>
							<option value="Price: High to Low">
								Price: High to Low
							</option>
						</select>
					</div>
				</div>

				{filteredItems.length > 0 ? (
					filteredItems.map((item) => (
						<div
							key={item.id}
							className="flex justify-between items-center border-t border-gray-200 py-4"
						>
							<div className="flex items-center gap-4">
								<img
									src={
										item.images?.[0]
											? `http://localhost:8787/${item.images[0]}`
											: `https://placehold.co/64x64?text=${item.item_name}`
									}
									alt={item.item_name}
									className="w-16 h-16 object-cover rounded-lg"
								/>
								<div>
									<div className="text-base font-bold text-gray-800 mb-1">
										{item.item_name}
									</div>
									<div className="text-sm text-gray-600 mb-1">
										{item.description || "No description"}
									</div>
								</div>
							</div>

							<div className="text-right">
								<div className="text-sm text-gray-600 mb-1">
									Status:{" "}
									<span
										className={
											item.item_status === "available"
												? "text-green-600 font-medium"
												: "text-red-500 font-medium"
										}
									>
										{item.item_status === "available"
											? "Available"
											: item.item_status
													.charAt(0)
													.toUpperCase() +
											  item.item_status.slice(1)}
									</span>{" "}
									| Rating:{" "}
									<span className="text-yellow-500 font-medium">
										{item.item_rating ?? "-"}
									</span>
								</div>
								<div className="font-bold text-gray-800 mb-2">
									{item.price_per_day.toLocaleString()}{" "}
									THB/day
								</div>
								<div className="flex gap-2 justify-end">
									<button
										onClick={() => deleteItem(item.id)}
										className="bg-gray-300 text-black px-3 py-1 rounded-lg hover:bg-gray-400"
									>
										Delete
									</button>
									<a
										href={`/lender/item/${item.id}`}
										className="bg-gray-700 text-white px-6 py-2 rounded-lg"
									>
										Edit
									</a>
								</div>
							</div>
						</div>
					))
				) : (
					<div className="text-center text-gray-500 py-10">
						No items found
					</div>
				)}
			</div>
		</div>
	);
};

export default Page;
