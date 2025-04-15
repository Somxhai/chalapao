"use client";

import { useParams } from "next/navigation";
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
import Image from "next/image";
import React from "react";

const Confirm = () => {
	const { itemId } = useParams();
	const item = items.find((i) => i.id === itemId);
	const lender = users.find((u) => u.id === item?.owner_id);
	const renter = users.find((u) => u.user_type === "renter");
	const image = itemImages.find((img) => img.item_id === item?.id);
	const address = renter?.address.find((addr) => addr.is_primary);

	return (
		<main className="container mx-auto px-16 py-8 text-gray-700">
			{/* Step Progress */}
			<div className="flex justify-center items-center gap-6 mb-10 text-sm">
				{["1", "2", "3", "4"].map((step, i) => (
					<React.Fragment key={`step-${step}`}>
						<div
							className={`flex items-center gap-1 ${step === "1" ? "" : "text-gray-400"}`}
						>
							<div
								className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === "1" ? "bg-black text-white" : "border border-gray-400"}`}
							>
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
						{step !== "4" && <hr className="w-8 border-t" />}
					</React.Fragment>
				))}
			</div>

			<div className="flex gap-10">
				{/* Left Block - Rental Details and Image */}
				<div className="w-1/3">
					<h1 className="text-3xl font-bold mb-6">Rental Details</h1>
					<img
						src={image?.image_url || "/camera.png"}
						alt={item?.name || "Product"}
						width={300}
						height={300}
						className="rounded-md"
					/>
					<p className="text-sm text-gray-500 mt-2">
						รายละเอียดสินค้า : {item?.description}
					</p>
				</div>

				{/* Right Block - 4 columns in a vertical layout */}
				<div className="flex flex-col gap-6 w-2/3">
					{/* Name Block */}
					<div>
						<h2 className="text-xl font-bold">{item?.name}</h2>
					</div>

					{/* 2.1 First Row: Lender and Renter */}
					<div className="flex gap-6">
						<div className="w-1/2">
							<h3 className="font-medium">Lender</h3>
							<p className="text-sm">
								ผู้ให้เช่า : {lender?.user_name}
							</p>
							<p className="text-sm">
								ชื่อ-สกุล : {lender?.first_name}{" "}
								{lender?.last_name}
							</p>
						</div>
						<div className="w-1/2">
							<h3 className="font-medium">
								Renter{" "}
								<span className="text-xs underline text-blue-500 cursor-pointer">
									แก้ไข/เลือกที่อยู่จัดส่ง
								</span>
							</h3>
							<p className="text-sm">
								ผู้เช่า : {renter?.user_name}
							</p>
							<p className="text-sm">
								ชื่อ-สกุล : {renter?.first_name}{" "}
								{renter?.last_name}
							</p>
							<p className="text-sm">
								ที่อยู่จัดส่ง :{" "}
								{address?.residence_info || "ที่อยู่"}
							</p>
						</div>
					</div>

					{/* 2.2 Second Row: Renting Info */}
					<div>
						<h3 className="font-medium">Renting</h3>
						<p className="text-sm">ระยะเวลาการเช่า : 1 เดือน</p>
						<p className="text-sm">
							ตั้งแต่วันที่ : 22 มีนาคม 2568
						</p>
						<p className="text-sm">ถึงวันที่ : 22 เมษายน 2568</p>
						<p className="text-sm">
							เงื่อนไขและข้อตกลงการเช่า : {item?.rental_terms}
						</p>
						<p className="text-sm">
							เงื่อนไขและข้อตกลงการปรับ : {item?.penalty_terms}
						</p>
					</div>

					{/* 2.3 Third Row: Rental Fee + Agreements and Button */}
					<div>
						<h3 className="text-xl font-semibold">Rental Fee</h3>
						<div className="border p-4 rounded space-y-2 text-sm">
							<div className="flex items-center gap-2">
								<img
									src={image?.image_url || "/camera.png"}
									alt={item?.name || "Thumb"}
									width={60}
									height={60}
									className="rounded"
								/>
								<div>
									<p>{item?.name}</p>
									<p className="text-xs text-gray-500">
										ผู้ให้เช่า : {lender?.first_name}{" "}
										{lender?.last_name}
									</p>
								</div>
							</div>
							<div className="flex justify-between">
								<span>ค่าเช่า 1 เดือน</span>
								<span>
									{item ? item.price_per_day * 30 : 0} บาท
								</span>
							</div>
							<div className="flex justify-between">
								<span>ค่าจัดส่ง</span>
								<span>120 บาท</span>
							</div>
							<div className="text-xs text-gray-500">
								ไปที่ผู้เช่า :{" "}
								{address?.residence_info || "ที่อยู่"}
							</div>
							<div className="flex justify-between font-bold border-t pt-2">
								<span>รวม</span>
								<span>
									{item ? item.price_per_day * 30 + 120 : 0}{" "}
									บาท
								</span>
							</div>
							<div className="mt-4 space-y-2 text-sm">
								<div>
									<input type="checkbox" className="mr-2" />
									<span>
										ยอมรับเงื่อนไขและข้อตกลงในการเช่า
									</span>
								</div>
								<div>
									<input type="checkbox" className="mr-2" />
									<span>
										ยอมรับเงื่อนไขและข้อตกลงในการปรับ
									</span>
								</div>
								<div className="flex justify-end">
									<button className="bg-black text-white px-6 py-2 rounded hover:opacity-90">
										Submit Rental Request
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default Confirm;
