"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";

const Page = () => {
	const { userId } = useParams<{ userId: string }>();

	const [shop, setShop] = useState<any>(null);
	const [address, setAddress] = useState<any>(null);
	const [categories, setCategories] = useState<any[]>([]);
	const [items, setItems] = useState<any[]>([]);
	const [itemImages, setItemImages] = useState<any[]>([]);
	const [reviews, setReviews] = useState<any[]>([]);
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
		null
	);
	const [showAllItems, setShowAllItems] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [userRes, categoryRes, itemRes, reviewRes] =
					await Promise.all([
						fetch(`/api/user/info/${userId}`),
						fetch(`/api/category`),
						fetch(`/api/item/user/${userId}`),
						fetch(`/api/user/review/${userId}`),
					]);

				if (
					!userRes.ok ||
					!categoryRes.ok ||
					!itemRes.ok ||
					!reviewRes.ok
				) {
					throw new Error("Failed to fetch some data");
				}

				const [userData, categoryData, itemData, reviewData] =
					await Promise.all([
						userRes.json(),
						categoryRes.json(),
						itemRes.json(),
						reviewRes.json(),
					]);

				setShop(userData);
				setAddress(userData.address?.find((a: any) => a.is_primary));
				setCategories(categoryData);
				setItems(itemData);
				setReviews(reviewData);
			} catch (error) {
				console.error(error);
				notFound();
			} finally {
				setLoading(false);
			}
		};

		if (userId) fetchData();
	}, [userId]);

	const filteredItems = items.filter((item) => {
		const inCategory = selectedCategoryId
			? item.category_id === selectedCategoryId
			: true;
		return inCategory;
	});

	const itemsToShow = showAllItems
		? filteredItems
		: filteredItems.slice(0, 3);

	const shopReviewsWithReviewer = reviews.map((r) => ({
		...r,
		reviewer_name: `${r.reviewer_info?.first_name || "Unknown"} ${
			r.reviewer_info?.last_name || ""
		}`,
	}));

	const getFirstImage = (itemId: string) =>
		itemImages.find((img) => img.item_id === itemId)?.path ||
		"/default-image.png";

	if (loading) return <div className="text-center py-20">Loading...</div>;

	if (!shop) return notFound();

	return (
		<>
			{/* Shop Header */}
			<div className="flex justify-between items-start p-6 w-full max-w-[1200px] mx-auto border-b border-gray-300 mb-8">
				<div className="flex-shrink-0">
					<img
						src={shop?.image_url || "/default-logo.png"}
						alt={shop?.user_name}
						className="w-20 h-20 rounded-full object-cover"
					/>
				</div>
				<div className="flex-1 text-left px-10">
					<div className="flex items-center gap-2">
						<h2 className="text-2xl font-bold">
							{shop?.first_name} {shop?.last_name}
						</h2>
						<span className="text-yellow-500">⭐</span>
						<span className="text-lg font-medium">
							{shop?.user_rating?.toFixed(0) || "–"}
						</span>
					</div>
					<p className="text-sm text-gray-600 mt-1">
						Equipment rental service with professional advice.
					</p>
				</div>
				<div className="w-[400px] text-sm text-gray-500 text-right break-words leading-relaxed">
					<div>
						Name: {shop?.first_name} {shop?.last_name}
					</div>
					<div>Phone: {shop?.phone_number}</div>
					<div>
						Address:{" "}
						{address
							? `${address.residence_info}, ${address.sub_district}, ${address.district}, ${address.province} ${address.postal_code}`
							: "No address found"}
					</div>
				</div>
			</div>

			{/* Category Tabs */}
			<div className="flex gap-6 justify-center pb-4 mb-8">
				<button
					className={`text-md font-medium ${
						selectedCategoryId === null
							? "text-black border-b-2 border-black"
							: "text-gray-500"
					}`}
					onClick={() => {
						setSelectedCategoryId(null);
						setShowAllItems(false);
					}}
				>
					All
				</button>
				{categories.map((cat) => (
					<button
						key={cat.id}
						className={`text-md font-medium transition duration-300 ease-in-out ${
							selectedCategoryId === cat.id
								? "text-black border-b-2 border-black"
								: "text-gray-500 hover:text-black"
						}`}
						onClick={() => {
							setSelectedCategoryId(cat.id);
							setShowAllItems(false);
						}}
					>
						{cat.name}
					</button>
				))}
			</div>

			{/* Items */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-[1200px] mx-auto mb-10">
				{itemsToShow.length === 0 ? (
					<p className="text-center text-gray-500 col-span-full">
						No items found in this category
					</p>
				) : (
					itemsToShow.map((item) => (
						<Link key={item.id} href={`/site/item/${item.id}`}>
							<div className="border rounded-lg p-4 shadow-sm cursor-pointer">
								<div className="relative w-full aspect-square mb-2">
									<img
										src={getFirstImage(item.id)}
										alt={item.item_name}
										className="absolute inset-0 w-full h-full object-contain rounded"
									/>
								</div>
								<div className="text-md font-semibold">
									{item.item_name}
								</div>
								<div className="text-sm text-gray-500">
									{item.price_per_day} THB / day
								</div>
								<div
									className={`text-xs mt-1 ${
										item.item_status === "available"
											? "text-green-600"
											: "text-red-500"
									}`}
								>
									{item.item_status === "available"
										? "Available"
										: "Rented"}
								</div>
							</div>
						</Link>
					))
				)}
			</div>

			{/* Show More Button */}
			{!showAllItems && filteredItems.length > 3 && (
				<div className="flex justify-center mb-12">
					<button
						className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md"
						onClick={() => setShowAllItems(true)}
					>
						Show More
					</button>
				</div>
			)}

			{/* Reviews */}
			<div className="max-w-[1200px] mx-auto mb-10 mt-10 pt-10 border-t border-gray-300">
				<h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
					{shopReviewsWithReviewer.map((review) => (
						<div
							key={review.id}
							className="p-4 border rounded-md shadow-sm bg-white text-sm"
						>
							<div className="text-yellow-500 mb-1">
								{"⭐".repeat(review.rating)}
							</div>
							<p className="text-gray-700">{review.comment}</p>
							<p className="mt-2 text-gray-400 text-xs">
								{review.reviewer_name}
							</p>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default Page;
