"use client";

import { data as addresses } from "@/data/address";
import { data as categories } from "@/data/category";
import { data as items } from "@/data/item";
import { data as itemImages } from "@/data/item_image";
import { data as itemReviews } from "@/data/item_review";
import { data as itemReviewImages } from "@/data/item_review_image";
import { data as keywords } from "@/data/keyword";
import { data as payments } from "@/data/payment";
import { data as rentals } from "@/data/rental";
import { data as users } from "@/data/user";
import { data as userReviews } from "@/data/user_review";
import Link from "next/link";
import React from "react";
import { useParams } from "next/navigation";

const Rental = () => {
	const { rentalId } = useParams();
	const rental = rentals.find((r) => r.id === rentalId);
	const item = items.find((i) => i.id === rental?.item_id);
	const image = item?.item_images?.[0];

	return (
		<main className="bg-gray-100 min-h-screen py-10 px-4 md:px-16">
			<div className="flex flex-col items-center text-center">
				{/* Status stepper */}
				<div className="flex justify-center items-center gap-6 mb-10 text-sm">
					{["1", "2", "3", "4"].map((step, i) => (
						<React.Fragment key={`step-${step}`}>
							<div className="flex items-center gap-1 text-black font-semibold">
								<div className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-black text-white">
									{step}
								</div>
								<span>
									{
										[
											"Details",
											"Confirming",
											"Payment",
											"Done",
										][i]
									}
								</span>
							</div>
							{step !== "4" && (
								<hr className="w-8 border-t border-black" />
							)}
						</React.Fragment>
					))}
				</div>

				{/* Icon - centered and translated down */}
				<div className="flex justify-center mb-6 transform translate-y-4">
					<img
						src="/icons/logo_black.svg"
						alt="Chalapao Icon"
						width={80}
						height={80}
					/>
				</div>

				{/* Text section */}
				<h2 className="text-2xl font-semibold mb-1">You're All Set!</h2>
				<p className="text-xs text-gray-600 mb-2">
					Reference Number:{" "}
					<span className="font-semibold text-black">
						#{rental?.id}
					</span>
				</p>
				<p className="text-gray-700 mb-6">
					Thank you! Your item will be on its way shortly.
				</p>

				{/* Button */}
				<Link href={`/item/${item?.id}`}>
					<button className="px-4 py-2 bg-gray-300 text-sm rounded shadow hover:opacity-90">
						Go to Item Page
					</button>
				</Link>
			</div>
		</main>
	);
};

export default Rental;
