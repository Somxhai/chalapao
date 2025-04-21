"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";

import { Carousel } from "flowbite-react";

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

const Page = () => {
	const { itemId } = useParams();
	const item = items.find((i) => i.id === itemId);
	const reviews = itemReviews.filter((r) => r.item_id === item?.id);
	const owner = users.find((u) => u.id === item?.owner_id);
	const images = itemImages.filter((img) => img.item_id === item?.id);
	if (!item) return notFound();
	const fullStars = Math.floor(item.item_rating);
	const hasHalfStar = item.item_rating - fullStars >= 0.5;
	const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
	return (
		<>
			<div className="flex items-start gap-10">
				<div className="w-1/2 aspect-square bg-gray-100 rounded-lg shadow flex items-center justify-center">
					<Carousel slide={false}>
						{images.map((img, i) => (
							<div key={i} className="w-full h-full">
								<img
									src={img.image_url}
									alt={`image-${i}`}
									className="w-full h-full object-cover"
								/>
							</div>
						))}
					</Carousel>
				</div>
				<div className="w-1/2 space-y-4">
					<div className="flex justify-between items-center">
						<div className="bg-gray-200 text-sm text-gray-600 px-3 py-1 rounded-lg">
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
												offset="70%"
												stopColor="#fbbf24"
											/>
											<stop
												offset="30%"
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
					<div className="mt-4 space-y-4">
						<h2 className="font-medium">
							Choose Your Rental Period
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="flex flex-col">
								<label
									className="text-sm mb-1"
									htmlFor="startDate"
								>
									Start :
								</label>
								<input
									id="startDate"
									type="date"
									min="2023-01-01"
									max="2025-12-31"
									className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div className="flex flex-col">
								<label
									className="text-sm mb-1"
									htmlFor="endDate"
								>
									End :
								</label>
								<input
									id="endDate"
									type="date"
									min="2023-01-01"
									max="2025-12-31"
									className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>
					</div>
					<div className="text-2xl font-bold mt-4">
						{item.price_per_day}{" "}
						<span className="text-sm font-normal">Baht</span>
					</div>
					<div>
						<a
							href="http://localhost:3000/rental/confirm/550e8400-e29b-41d4-a716-446655440000"
							className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:opacity-90"
						>
							Continue
						</a>
					</div>
				</div>
			</div>
			<div className="space-y-2 pt-6 mt-6 border-t">
				<p className="text-xs text-gray-400">
					{item.rental_terms}
					<br />
					{item.penalty_terms}
				</p>
				<div className="flex gap-24 text-sm text-gray-500 pt-2 justify-center">
					<button className="hover:underline font-medium text-black">
						Product Details
					</button>
					<button className="hover:underline">
						Reviews ({reviews.length})
					</button>
					<button className="hover:underline">
						Rental Terms and Conditions
					</button>
					<button className="hover:underline">
						Penalty and Fine Conditions
					</button>
				</div>
			</div>
		</>
	);
};

export default Page;
