"use client";

import { useState, useEffect, Key } from "react";
import { useParams, notFound } from "next/navigation";

import { Carousel } from "flowbite-react";

import { ItemType } from "@/types/item";
import { UserType } from "@/types/user";
import { ItemReviewType } from "@/types/item_review";

const Page = () => {
	const { itemId } = useParams();

	const [item, setItem] = useState<ItemType>();
	const [images, setImages] = useState<string[]>([]);
	const [ownerInfo, setOwnerInfo] = useState<UserType>();
	const [itemReviews, setItemReviews] = useState<ItemReviewType[]>([]);

	const [startDate, setStartDate] = useState<string>();
	const [endDate, setEndDate] = useState<string>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchItems = async () => {
			try {
				const response = await fetch(`/api/item/${itemId}`);
				if (!response.ok) throw new Error("Failed to fetch item");
				const data = await response.json();

				setItem(data.item);
				setImages(data.images ?? []);
				setOwnerInfo(data.owner_info);
			} catch (error) {
				console.error("Error fetching item:", error);
			} finally {
				setLoading(false);
			}
		};

		const fetchReviews = async () => {
			try {
				const response = await fetch(`/api/review/item/${itemId}`);
				if (!response.ok) {
					throw new Error("Failed to fetch reviews");
				}
				const data = await response.json();
				setItemReviews(data);
			} catch (error) {
				console.error("Error fetching reviews:", error);
			}
		};

		fetchItems();
		fetchReviews();
	}, [itemId]);

	if (loading) return <div>Loading...</div>;

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
									className="rounded-t-lg aspect-square w-full object-cover"
									src={`http://localhost:8787/${img}`}
									alt={item?.item_name}
								/>
							</div>
						))}
					</Carousel>
				</div>
				<div className="flex flex-col gap-4 w-1/2">
					<div className="flex justify-between items-center">
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
							<div className="text-sm text-gray-500 ms-2">
								({item.item_rating})
							</div>
						</div>
						<div className="bg-gray-200 text-sm text-gray-600 px-3 py-1 rounded-lg">
							{item.item_status}
						</div>
					</div>
					<h1 className="text-3xl font-semibold">{item.item_name}</h1>
					<div className="text-sm text-gray-500">
						Owner: {ownerInfo?.first_name} {ownerInfo?.last_name}
						<br />
						{item.rental_terms}
						<br />
						{item.penalty_terms}
					</div>
					<div className="space-y-2">
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
									onChange={(e) => {
										const startDate = new Date(
											e.target.value
										);
										const endDate = new Date(
											(
												document.getElementById(
													"endDate"
												) as HTMLInputElement
											)?.value
										);
										if (endDate < startDate) {
											alert(
												"End date must be after start date."
											);
										}
										setStartDate(e.target.value);
									}}
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
									onChange={(e) => {
										const startDate = new Date(
											(
												document.getElementById(
													"startDate"
												) as HTMLInputElement
											)?.value
										);
										const endDate = new Date(
											e.target.value
										);
										if (endDate < startDate) {
											alert(
												"End date must be after start date."
											);
										}
										setEndDate(e.target.value);
									}}
									className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>
					</div>
					<div className="flex justify-between">
						<div className="text-2xl font-bold">
							{item.price_per_day}{" "}
							<span className="text-sm font-normal">Baht</span>
						</div>
						<button
							onClick={() => {
								if (!startDate || !endDate) {
									alert(
										"Please select both start and end dates."
									);
									return;
								}
								window.location.href = `/rental/confirm/${itemId}?startDate=${startDate}&endDate=${endDate}`;
							}}
							className="bg-gray-700 text-white px-6 py-2 rounded-lg"
						>
							Continue
						</button>
					</div>
				</div>
			</div>
			<div className="flex flex-col mt-6 border-t pt-4">
				<h2 className="text-2xl font-semibold mb-4">Reviews</h2>
				{itemReviews && itemReviews.length > 0 ? (
					itemReviews.map((review) => (
						<div
							key={review.id}
							className="flex flex-col gap-2 mb-4 border-b p-4 bg-white rounded-lg shadow"
						>
							<div className="flex items-center gap-2">
								<div className="flex items-center text-[#fbbf24]">
									{[...Array(review.rating)].map((_, i) => (
										<svg
											key={`review-full-${i}`}
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											viewBox="0 0 20 20"
											className="w-4 h-4"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 0 0 .95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 0 0-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.538 1.118l-3.38-2.455a1 1 0 0 0-1.175 0l-3.38 2.455c-.783.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 0 0-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 0 0 .95-.69l1.287-3.967z" />
										</svg>
									))}
								</div>
								<span className="text-sm text-gray-500">
									{new Date(
										review.created_at
									).toLocaleDateString()}
								</span>
							</div>
							{review.images && review.images.length > 0 && (
								<div className="flex gap-2 mt-2">
									{review.images.map((img, i) => (
										<img
											key={i}
											src={`http://localhost:8787/${img}`}
											alt={`Review Image ${i + 1}`}
											className="w-16 h-16 object-cover rounded-lg"
										/>
									))}
								</div>
							)}
							<p className="text-sm text-gray-700">
								{review.comment}
							</p>
						</div>
					))
				) : (
					<p className="text-sm text-gray-500">No reviews yet.</p>
				)}
			</div>
		</>
	);
};

export default Page;
