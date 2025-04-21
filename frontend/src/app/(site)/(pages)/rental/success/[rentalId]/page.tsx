"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";

import Step from "@/components/Rental/step";

import Header from "@/components/Header";

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

const Page = () => {
	const { rentalId } = useParams();
	const rental = rentals.find((r) => r.id === rentalId);
	const item = items.find((i) => i.id === rental?.item_id);
	return (
		<>
			<Header>{Step(4)}</Header>
			<main className="container mx-auto px-16 py-8">
				<div className="flex flex-col items-center text-center">
					<div className="flex justify-center mb-6 transform translate-y-4">
						<img
							src="/icons/logo_black.svg"
							alt="Chalapao Icon"
							width={80}
							height={80}
						/>
					</div>
					<h2 className="text-2xl font-semibold mb-1">
						You're All Set!
					</h2>
					<p className="text-xs text-gray-600 mb-2">
						Reference Number:{" "}
						<span className="font-semibold text-black">
							#{rental?.id}
						</span>
					</p>
					<p className="text-gray-700 mb-6">
						Thank you! Your item will be on its way shortly.
					</p>{" "}
					<Link href={`/item/${item?.id}`}>
						<button className="px-4 py-2 bg-gray-300 text-sm rounded shadow hover:opacity-90">
							Go to Item Page
						</button>
					</Link>
				</div>
			</main>
		</>
	);
};

export default Page;
