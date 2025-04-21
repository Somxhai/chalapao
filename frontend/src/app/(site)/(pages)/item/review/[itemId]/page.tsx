"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";

import { data as items } from "@/data/item";

const ReviewForm = () => {
	const { itemId } = useParams();
	const item = items.find((item) => item.id === itemId);
	const [itemRating, setItemRating] = useState(0);
	const [ownerRating, setOwnerRating] = useState(0);
	const [description, setDescription] = useState("");
	const [ownerFeedback, setOwnerFeedback] = useState("");
	return (
		<>
			<div className="max-w-2xl mx-auto space-y-6">
				<h1 className="text-2xl font-semibold">Review</h1>
				<div className="flex flex-col md:flex-row gap-6">
					<div className="flex-shrink-0 flex justify-center">
						<img
							src={
								item?.item_images[0]?.image_url ||
								"/default.png"
							}
							alt={item?.name}
							className="rounded-lg object-contain max-h-[220px]"
						/>
					</div>
					<div className="flex-1 space-y-2">
						<h2 className="text-xl font-semibold">{item?.name}</h2>
						<p className="text-sm text-gray-600 dark:text-gray-300">
							รายละเอียดการเช่า
						</p>
						<div>
							<p className="font-medium">คะแนนสินค้า :</p>
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
						<div>
							<p className="font-medium mt-4">
								คะแนนผู้ให้เช่า :
							</p>
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
				<div className="space-y-6">
					<div>
						<label className="font-medium block">
							คำบรรยายสินค้า
						</label>
						<textarea
							className="w-full p-4 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-700"
							rows={4}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
					<div>
						<label className="font-medium block">
							คำบรรยายผู้ให้เช่า
						</label>
						<textarea
							className="w-full p-4 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-700"
							rows={3}
							value={ownerFeedback}
							onChange={(e) => setOwnerFeedback(e.target.value)}
						/>
					</div>
					{/* <div className="space-y-2">
						<label className="font-medium block">
							รูปภาพประกอบ
						</label>
						<button className="px-4 py-2 text-sm rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600">
							เพิ่มรูปภาพ
						</button>
					</div> */}
					<div className="flex justify-end">
						<button className="bg-gray-700 text-white px-6 py-2 rounded-lg">
							Save
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default ReviewForm;
