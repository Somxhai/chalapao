"use client";

import { useState, useEffect } from "react";

import Sort from "@/components/Items/sort";
import ItemCard from "@/components/Items/item";

import Header from "@/components/Header";
import Links from "@/components/Header/links";

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

const Page = () => {
	return (
		<>
			<Header>
				<Links />
			</Header>
			<main className="container mx-auto px-16 py-8">
				<div className="flex justify-between mb-6">
					<h1 className="text-3xl font-bold">Popular Items</h1>
					<Sort />
				</div>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{items.map((item) => (
						<ItemCard key={item.id} item={item} />
					))}
				</div>
			</main>
		</>
	);
};

export default Page;
