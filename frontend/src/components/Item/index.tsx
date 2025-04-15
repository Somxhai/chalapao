"use client";

import { useParams } from "next/navigation";
import { data as addresses } from "@/data/address";
import { data as categories } from "@/data/category";
import { data as items } from "@/data/item";
import { data as itemImages } from "@/data/item_image";
import { data as itemReviews } from "@/data/item_review";
import { data as keywords } from "@/data/keyword";
import { data as payments } from "@/data/payment";
import { data as rentals } from "@/data/rental";
import { data as users } from "@/data/user";
import { data as userReviews } from "@/data/user_review";
import { useState } from "react";
import { Rating, RatingStar } from "flowbite-react";

const Item = () => {
	const { itemId } = useParams();
	const item = items.find((i) => i.id === itemId);
	const category = categories.find((c) => c.id === item?.category_id);
	const reviews = itemReviews.filter((r) => r.item_id === item?.id);
	const owner = users.find((u) => u.id === item?.owner_id);
	const images = itemImages.filter((img) => img.item_id === item?.id);

	const [leaseTerm, setLeaseTerm] = useState(1);

	if (!item) return <div className="text-center py-10">Item not found</div>;

	const fullStars = Math.floor(item.item_rating);
	const hasHalfStar = item.item_rating - fullStars >= 0.5;
	const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

	return (
		<main className="container mx-auto px-16 py-8 text-gray-700 space-y-10">
			{/* Top Section - img and Info Side by Side */}
			<div className="flex justify-between items-start gap-10">
				{/* Left - img (Replaced Carousel with Centered Expandable img) */}
				<div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
					<div className="w-full max-w-[400px] h-[400px] bg-gray-100 rounded-md shadow-md flex items-center justify-center">
						<img
							src={images[0]?.image_url || "/camera.png"}
							alt={item.name}
							width={400}
							height={400}
							className="object-contain"
						/>
					</div>
					<div className="flex gap-2 justify-center">
						{images.slice(1, 4).map((img, i) => (
							<div
								key={i}
								className="w-12 h-12 rounded cursor-pointer hover:opacity-80 overflow-hidden"
							>
								<img
									src={img.image_url}
									alt={`thumb-${i}`}
									width={48}
									height={48}
								/>
							</div>
						))}
					</div>
				</div>

				{/* Right - Info */}
				<div className="flex-1 max-w-xl space-y-4">
					<div className="flex justify-between items-center">
						<div className="text-lg text-gray-500">
							{category?.name} &gt; {item.name}
						</div>
						<div className="bg-gray-200 text-sm text-gray-600 px-3 py-1 rounded-full">
							{item.item_status}
						</div>
					</div>

					<h1 className="text-3xl font-semibold">{item.name}</h1>

					<div className="flex items-center gap-2">
						<div className="flex items-center text-[#fbbf24]">
							{[...Array(fullStars)].map((_, i) => (
								<svg
									key={`full-${i}`}
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 20 20"
									className="w-5 h-5"
								>
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 0 0 .95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 0 0-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.538 1.118l-3.38-2.455a1 1 0 0 0-1.175 0l-3.38 2.455c-.783.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 0 0-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 0 0 .95-.69l1.287-3.967z" />
								</svg>
							))}
							{hasHalfStar && (
								<svg
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="url(#halfGrad)"
									viewBox="0 0 20 20"
									className="w-5 h-5"
								>
									<defs>
										<linearGradient id="halfGrad">
											<stop
												offset="50%"
												stopColor="#fbbf24"
											/>
											<stop
												offset="50%"
												stopColor="lightgray"
											/>
										</linearGradient>
									</defs>
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 0 0 .95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 0 0-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.538 1.118l-3.38-2.455a1 1 0 0 0-1.175 0l-3.38 2.455c-.783.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 0 0-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 0 0 .95-.69l1.287-3.967z" />
								</svg>
							)}
							{[...Array(emptyStars)].map((_, i) => (
								<svg
									key={`empty-${i}`}
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="lightgray"
									viewBox="0 0 20 20"
									className="w-5 h-5"
								>
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 0 0 .95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 0 0-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.538 1.118l-3.38-2.455a1 1 0 0 0-1.175 0l-3.38 2.455c-.783.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 0 0-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 0 0 .95-.69l1.287-3.967z" />
								</svg>
							))}
						</div>
						<div className="text-sm text-gray-500">
							({item.item_rating})
						</div>
					</div>

					<div className="text-sm text-gray-500">
						Owner: {owner?.first_name} {owner?.last_name}
					</div>

					<div>
						<h2 className="font-medium">Lease Term</h2>
						<div className="flex gap-4 mt-1">
							{[1, 3, 6].map((term) => (
								<button
									key={term}
									className={`px-3 py-1 border rounded hover:bg-gray-100 ${leaseTerm === term ? "border-black" : "border-gray-400"}`}
									onClick={() => setLeaseTerm(term)}
								>
									{term} Month{term > 1 ? "s" : ""}
								</button>
							))}
						</div>
					</div>

					<div className="mt-4 space-y-2">
						<h2 className="font-medium">
							Choose Your Rental Period
						</h2>
						<div className="flex gap-4 items-center">
							<label className="text-sm">Start :</label>
							<input
								className="border px-2 py-1 rounded text-sm"
								defaultValue=""
							/>
						</div>
						<div className="flex gap-4 items-center">
							<label className="text-sm">End :</label>
							<input
								className="border px-2 py-1 rounded text-sm bg-gray-100"
								defaultValue=""
								disabled
							/>
						</div>
					</div>

					<div className="text-2xl font-bold mt-4">
						{item.price_per_day}{" "}
						<span className="text-sm font-normal">Baht</span>
					</div>

					<button className="bg-black text-white px-6 py-2 rounded hover:opacity-90">
						Continue
					</button>
				</div>
			</div>

			{/* Bottom Section - Additional Info */}
			<div className="space-y-2 pt-6 border-t">
				<p className="text-xs text-gray-400">
					{item.rental_terms}
					<br />
					{item.penalty_terms}
				</p>

				<div className="flex gap-24 text-sm text-gray-500 pt-2 justify-center">
					<a
						href="#"
						className="hover:underline font-medium text-black"
					>
						Product Details
					</a>
					<a href="#" className="hover:underline">
						Reviews ({reviews.length})
					</a>
					<a href="#" className="hover:underline">
						Rental Terms and Conditions
					</a>
					<a href="#" className="hover:underline">
						Penalty and Fine Conditions
					</a>
				</div>
			</div>
		</main>
	);
};

export default Item;
