"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ItemType } from "@/types/item";

const Page = () => {
	const { itemId } = useParams<{ itemId: string }>();
	const router = useRouter();

	const [loading, setLoading] = useState(true);
	const [item, setItem] = useState<ItemType>();
	const [itemRating, setItemRating] = useState(0);
	const [ownerRating, setOwnerRating] = useState(0);
	const [description, setDescription] = useState("");
	const [ownerFeedback, setOwnerFeedback] = useState("");

	useEffect(() => {
		const fetchItem = async () => {
			try {
				const res = await fetch(`/api/item/${itemId}`);
				if (!res.ok) throw new Error("Failed to fetch item data");
				const data = await res.json();
				setItem(data);
			} catch (error) {
				console.error("Error fetching item:", error);
			} finally {
				setLoading(false);
			}
		};

		if (itemId) fetchItem();
	}, [itemId]);

	const handleSave = async () => {
		if (!itemId || !item) {
			alert("Item not found.");
			return;
		}
		if (itemRating === 0) {
			alert("Please rate the item.");
			return;
		}
		if (ownerRating === 0) {
			alert("Please rate the owner.");
			return;
		}

		try {
			// Submit Item Review
			await fetch(`/api/review/item/${itemId}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					rating: itemRating,
					comment: description,
				}),
			});

			// Submit Owner (User) Review
			await fetch(`/api/review/user/${item.owner_id}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					rating: ownerRating,
					comment: ownerFeedback,
				}),
			});

			alert("Review saved successfully.");
			router.push("/rentals"); // After save, navigate away (or change to where you want)
		} catch (error) {
			console.error("Error saving review:", error);
			alert("Failed to save the review. Please try again.");
		}
	};

	if (loading) return <div className="text-center py-20">Loading...</div>;

	if (!item)
		return (
			<div className="text-center py-20 text-red-500">
				Item not found.
			</div>
		);

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<h1 className="text-2xl font-semibold">Review</h1>
			<div className="flex flex-col md:flex-row gap-6">
				<div className="flex-shrink-0 w-full md:w-1/2">
					<Image
						className="rounded-lg aspect-square w-full object-cover"
						src={
							item.images?.[0]
								? `/api/${item.images[0]}`
								: ""
						}
						width={500}
						height={500}
						alt={item?.item_name}
					/>
				</div>
				<div className="flex-1 space-y-4">
					<h2 className="text-xl font-semibold">{item.item_name}</h2>

					{/* Item Rating */}
					<div>
						<p className="font-medium">Item Rating:</p>
						<div className="flex gap-1 mt-1">
							{[1, 2, 3, 4, 5].map((star) => (
								<span
									key={star}
									onClick={() => setItemRating(star)}
									className={`text-2xl cursor-pointer ${
										star <= itemRating
											? "text-yellow-400"
											: "text-gray-400"
									}`}
								>
									★
								</span>
							))}
						</div>
					</div>

					{/* Owner Rating */}
					<div>
						<p className="font-medium mt-4">Owner Rating:</p>
						<div className="flex gap-1 mt-1">
							{[1, 2, 3, 4, 5].map((star) => (
								<span
									key={star}
									onClick={() => setOwnerRating(star)}
									className={`text-2xl cursor-pointer ${
										star <= ownerRating
											? "text-yellow-400"
											: "text-gray-400"
									}`}
								>
									★
								</span>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Review Details */}
			<div className="space-y-6">
				<div>
					<label className="font-medium block mb-1">
						Item Review
					</label>
					<textarea
						className="w-full p-4 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-700"
						rows={4}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>

				<div>
					<label className="font-medium block mb-1">
						Owner Review
					</label>
					<textarea
						className="w-full p-4 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-700"
						rows={3}
						value={ownerFeedback}
						onChange={(e) => setOwnerFeedback(e.target.value)}
					/>
				</div>

				<div className="flex justify-end">
					<button
						onClick={handleSave}
						className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);
};

export default Page;
