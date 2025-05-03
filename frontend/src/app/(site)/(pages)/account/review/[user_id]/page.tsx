"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { Card, Rating } from "flowbite-react";

import { data as users } from "@/data/user";
import { data as items } from "@/data/item";
import { data as itemReviews } from "@/data/item_review";
import { data as itemImages } from "@/data/item_image";
import { data as userReviews } from "@/data/user_review";

const avg = (nums: number[]) =>
	nums.length ? nums.reduce((s, n) => s + n, 0) / nums.length : 0;

const thDate = (iso: string) =>
	new Date(iso).toLocaleDateString("th-TH", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

export default function Page() {
	const { user_id } = useParams<{ user_id: string }>();
	const user = users.find((u) => u.id === user_id);
	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-gray-500">ไม่พบข้อมูลผู้ใช้งาน</p>
			</div>
		);
	}
	const myItemReviews = itemReviews.filter((r) => r.user_id === user.id);
	const myPeerReviews = userReviews.filter((r) => r.user_id === user.id);
	const overall = avg([
		...myItemReviews.map((r) => r.rating),
		...myPeerReviews.map((r) => r.rating),
	]).toFixed(1);
	return (
		<div className="min-h-screen px-6 py-10">
			<div className="flex flex-col items-center gap-2 mb-10">
				<div className="w-28 h-28 relative rounded-lg overflow-hidden">
					{user.image_url && (
						<img
							src={user.image_url}
							alt={user.user_name}
							className="w-28 h-28 object-cover rounded-lg"
						/>
					)}
				</div>
				<h1 className="text-2xl font-semibold">
					{user.first_name} {user.last_name}
				</h1>
				<p className="text-gray-500">{user.user_name}</p>
				<div className="flex items-center gap-1 text-lg">
					<svg
						key={`full`}
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 20 20"
						className="w-5 h-5"
					>
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 0 0 .95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 0 0-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.538 1.118l-3.38-2.455a1 1 0 0 0-1.175 0l-3.38 2.455c-.783.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 0 0-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 0 0 .95-.69l1.287-3.967z" />
					</svg>
					<span className="font-semibold">{overall}</span>
					<span className="text-gray-600">/ 5.0</span>
				</div>
			</div>
			<section className="mb-14">
				<h2 className="text-lg font-semibold mb-4">Product Review</h2>
				{myItemReviews.length === 0 ? (
					<p className="text-gray-500">ยังไม่มีรีวิวสินค้า</p>
				) : (
					<div className="flex flex-col items-center gap-6">
						{myItemReviews.map((rev) => {
							const item = items.find(
								(i) => i.id === rev.item_id
							);
							const firstImg =
								rev.item_review_images?.[0]?.image_url ??
								itemImages.find(
									(img) => img.item_id === item?.id
								)?.image_url;
							return (
								<Card key={rev.id} className="w-72">
									<h3 className="font-semibold text-sm mb-1">
										{item?.name ?? "Unknown item"}
									</h3>
									<p className="flex items-center gap-1 text-xs text-gray-500 mb-1">
										GearGo Rental
									</p>
									<Rating size="sm" className="mb-1">
										{[...Array(1)].map((_, i) => (
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
										<span className="ml-1 text-xs">
											{rev.rating} / 5
										</span>
									</Rating>
									{rev.comment && (
										<p className="text-xs leading-snug mb-2">
											{rev.comment}
										</p>
									)}
									{firstImg && (
										<img
											src={firstImg}
											alt="review img"
											width={240}
											height={160}
											className="rounded-lg mb-2 object-cover"
										/>
									)}
									<p className="text-right text-[10px] text-gray-500">
										{thDate(rev.created_at)}
									</p>
								</Card>
							);
						})}
					</div>
				)}
			</section>
			<section>
				<h2 className="text-lg font-semibold mb-4">
					Feedback from Lender
				</h2>
				{myPeerReviews.length === 0 ? (
					<p className="text-gray-500">
						ยังไม่มีความคิดเห็นจากผู้ให้เช่า
					</p>
				) : (
					<div className="flex flex-col items-center gap-6">
						{myPeerReviews.map((rev) => {
							const reviewer = users.find(
								(u) => u.id === rev.reviewer_id
							);
							return (
								<Card key={rev.id} className="w-72">
									<h3 className="font-semibold text-sm mb-1">
										Feedback
									</h3>
									<p className="flex items-center gap-1 text-xs text-gray-500 mb-1">
										{" "}
										{reviewer?.user_name ?? "Unknown"}
									</p>
									<Rating size="sm" className="mb-1">
										{[...Array(1)].map((_, i) => (
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
										<span className="ml-1 text-xs">
											{rev.rating} / 5
										</span>
									</Rating>
									{rev.comment && (
										<p className="text-xs leading-snug mb-2">
											{rev.comment}
										</p>
									)}
									<p className="text-right text-[10px] text-gray-500">
										{thDate(rev.created_at)}
									</p>
								</Card>
							);
						})}
					</div>
				)}
			</section>
			<div className="text-center mt-12">
				<Link href="/" className="text-blue-600 underline text-sm">
					กลับหน้าแรก
				</Link>
			</div>
		</div>
	);
}
