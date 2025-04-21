"use client";

import { useState } from "react";
import Link from "next/link";

import { data as addresses } from "@/data/address";
import { data as categories } from "@/data/category";
import { data as items } from "@/data/item";
import { data as itemImages } from "@/data/item_image";
import { data as userReviews } from "@/data/user_review";
import { data as users } from "@/data/user";

const userId = "2222222222";
const shop = users.find((u) => u.id === userId);
const address = shop?.address.find((a) => a.is_primary);

const Page = () => {
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
		null
	);
	const [showAllItems, setShowAllItems] = useState(false);
	const filteredItems = items.filter((item) => {
		const isOwner = item.owner_id === userId;
		const inCategory = selectedCategoryId
			? item.category_id === selectedCategoryId
			: true;
		return isOwner && inCategory;
	});
	const itemsToShow = showAllItems
		? filteredItems
		: filteredItems.slice(0, 3);
	const shopReviewsWithReviewer = userReviews
		.filter((r) => r.user_id === userId)
		.map((r) => {
			const reviewer = users.find((u) => u.id === r.reviewer_id);
			return {
				...r,
				reviewer_name: `${reviewer?.first_name || "ไม่ทราบ"} ${
					reviewer?.last_name || ""
				}`,
			};
		});
	const getFirstImage = (itemId: string) =>
		itemImages.find((img) => img.item_id === itemId)?.image_url ||
		"/default-image.png";
	return (
		<>
			<div className="mx-auto px-6 mb-8 mt-5">
				<h1 className="text-3xl font-bold mb-4">
					Storefront Management
				</h1>
				<div className="w-full bg-gray-200 h-32 rounded-lg flex justify-center items-center">
					<span className="text-xl text-gray-700 font-semibold">
						Dashboard
					</span>
				</div>
			</div>
			<div className="w-full mx-auto px-6 mb-8">
				<div className="flex justify-between items-start">
					<div className="flex gap-4 items-center">
						<div className="flex-shrink-0">
							<img
								src={shop?.image_url || "/default-logo.png"}
								alt={shop?.user_name}
								className="w-20 h-20 rounded-full object-cover"
							/>
						</div>
						<div>
							<h2 className="text-2xl font-bold">
								{shop?.first_name} {shop?.last_name}
							</h2>
							<div className="flex items-center gap-1 mt-1">
								<span className="text-yellow-500">⭐</span>
								<span className="text-xl font-medium">
									{shop?.user_rating?.toFixed(2) || "–"}
								</span>
							</div>
							<p className="text-sm text-gray-600 mt-1">
								ให้บริการเช่าอุปกรณ์ครบวงจร
								พร้อมคำแนะนำจากมืออาชีพ
							</p>
						</div>
					</div>
					<div className="text-right">
						<Link
							href={`shop/edit`}
							className="text-md font-medium underline hover:text-gray-700"
						>
							แก้ไขหน้าร้าน
						</Link>
						<div className="text-sm text-gray-500 mt-2 leading-relaxed">
							<div>
								ชื่อ: {shop?.first_name} {shop?.last_name}
							</div>
							<div>โทร: {shop?.phone}</div>
							<div>
								ที่อยู่:{" "}
								{address
									? `${address.residence_info}, ${address.subdistrict}, ${address.district}, ${address.province} ${address.postal_code}`
									: "ไม่พบที่อยู่"}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="mx-auto px-6 mb-8">
				<div className="flex gap-6 justify-center pb-4">
					<button
						className={`text-md font-medium ${
							selectedCategoryId === null
								? "border-b-2 border-black"
								: "text-gray-500"
						}`}
						onClick={() => {
							setSelectedCategoryId(null);
							setShowAllItems(false);
						}}
					>
						ทั้งหมด
					</button>
					{categories.map((cat) => (
						<button
							key={cat.id}
							className={`text-md font-medium transition duration-300 ease-in-out ${
								selectedCategoryId === cat.id
									? "border-b-2 border-black"
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
			</div>
			<div className="mx-auto px-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
					{itemsToShow.length === 0 ? (
						<p className="text-center text-gray-500 col-span-full">
							ไม่พบสินค้าในหมวดนี้
						</p>
					) : (
						itemsToShow.map((item) => (
							<Link key={item.id} href={`/site/item/${item.id}`}>
								<div className="border rounded-lg p-4 shadow-sm cursor-pointer">
									<div className="relative w-full aspect-square mb-2">
										<img
											src={getFirstImage(item.id)}
											alt={item.name}
											className="absolute inset-0 w-full aspect-square object-cover rounded"
										/>
									</div>
									<div className="text-md font-semibold">
										{item.name}
									</div>
									<div className="text-sm text-gray-500">
										{item.price_per_day} บาท / วัน
									</div>
									<div
										className={`text-xs mt-1 ${
											item.item_status === "Available"
												? "text-green-600"
												: "text-red-500"
										}`}
									>
										{item.item_status === "Available"
											? "Available"
											: "Rented"}
									</div>
								</div>
							</Link>
						))
					)}
				</div>
				{!showAllItems && filteredItems.length > 3 && (
					<div className="flex justify-center mb-12">
						<button
							className="bg-gray-700 text-white px-6 py-2 rounded-lg"
							onClick={() => setShowAllItems(true)}
						>
							แสดงเพิ่มเติม
						</button>
					</div>
				)}
			</div>
		</>
	);
};

export default Page;
