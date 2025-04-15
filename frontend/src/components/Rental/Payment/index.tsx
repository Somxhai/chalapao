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
import React, { useState } from "react";
import { useParams } from "next/navigation";

const Payment = () => {
	const params = useParams();
	const rentalId = params?.rentalId?.toString();

	const rental = rentals.find((r) => r.id === rentalId);
	const item = items.find((i) => i.id === rental?.item_id);
	const payment = payments.find((p) => p.id === rental?.payment_id);
	const renter = users.find((u) => u.id === rental?.renter_id);
	const lender = users.find((u) => u.id === item?.owner_id);
	const image = item?.item_images?.[0];
	const address = renter?.address.find((addr) => addr.is_primary);

	const [selectedMethod, setSelectedMethod] = useState("TrueMoney");
	const [phoneNumber, setPhoneNumber] = useState("");

	return (
		<main className="container mx-auto px-16 py-8 text-gray-700">
			<div className="flex justify-center items-center gap-6 mb-10 text-sm">
				{["1", "2", "3", "4"].map((step, i) => (
					<React.Fragment key={`step-${step}`}>
						<div
							className={`flex items-center gap-1 ${+step <= 3 ? "" : "text-gray-400"}`}
						>
							<div
								className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${+step <= 3 ? "bg-black text-white" : "border border-gray-400"}`}
							>
								{step}
							</div>
							<span
								className={`${+step <= 3 ? "text-black font-semibold" : "text-gray-400"}`}
							>
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
							<hr
								className={`w-8 border-t ${+step < 3 ? "border-black" : "border-gray-300"}`}
							/>
						)}
					</React.Fragment>
				))}
			</div>

			<div className=" mb-6">
				<h1 className="text-3xl font-bold mb-6">Payment</h1>
			</div>

			<div className="max-w-xs mx-auto bg-white shadow-md rounded p-4 text-sm mb-10">
				<h1 className="text-2xl font-semibold mb-6">Rental Fee</h1>
				<div className="flex gap-2 items-start">
					<img
						src={image?.image_url || "/camera.png"}
						alt={item?.name || "Product"}
						width={64}
						height={64}
						className="rounded"
					/>
					<div>
						<p className="font-semibold">{item?.name}</p>
						<p className="text-xs text-gray-500">
							ผู้เช่า : {renter?.first_name} {renter?.last_name}
						</p>
						<p className="text-xs text-gray-500">
							ผู้ให้เช่า : {lender?.first_name}{" "}
							{lender?.last_name}
						</p>
					</div>
				</div>
				<div className="border-t mt-4 pt-4 space-y-1">
					<div className="flex justify-between">
						<span>ค่าเช่า 1 เดือน</span>
						<span>{item ? item.price_per_day * 30 : 0} บาท</span>
					</div>
					<div className="flex justify-between">
						<span>ค่าจัดส่ง</span>
						<span>120 บาท</span>
					</div>
					<p className="text-xs text-gray-500 mt-2">
						ทางจัดส่งแบบปกติ ไปที่ผู้เช่า:{" "}
						{address?.residence_info || "ไม่พบที่อยู่"}
					</p>
					<div className="flex justify-between border-t pt-2 font-bold">
						<span>รวม</span>
						<span>
							{payment?.total_price?.toFixed(2) || "0.00"} บาท
						</span>
					</div>
				</div>
			</div>

			<div className="text-center mb-6">
				<h2 className="text-base font-semibold mb-4">
					Payment Methods
				</h2>
				<div className="flex justify-center gap-6">
					{[
						{
							name: "TrueMoney",
							icon: "/icons/truemoneywallet.svg",
						},
						{ name: "ThaiQR", icon: "/icons/ThaiQR.svg" },
						{ name: "VISA", icon: "/icons/Visa.svg" },
						{ name: "PayPal", icon: "/icons/paypal.svg" },
					].map((method) => {
						const isSelected = selectedMethod === method.name;
						return (
							<div
								key={method.name}
								onClick={() => setSelectedMethod(method.name)}
								className="flex items-center gap-2 cursor-pointer"
							>
								{/* Dot on the left */}
								<div
									className={`w-3 h-3 rounded-full ${
										isSelected ? "bg-black" : "bg-gray-400"
									}`}
								/>
								{/* Box with icon and label */}
								<div
									className={`p-4 rounded-md shadow-sm border ${
										isSelected
											? "border-black"
											: "border-gray-200"
									} bg-white w-[120px] h-[80px] flex flex-col justify-center items-center`}
								>
									<img
										src={method.icon}
										alt={method.name}
										className="h-12 mb-1 object-contain" // 👈 เปลี่ยนจาก h-6 เป็น h-10
									/>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<div className="text-center mb-10">
				<h2 className="text-base font-semibold mb-2">
					Billing details
				</h2>
				{selectedMethod === "TrueMoney" && (
					<div className="max-w-xs mx-auto">
						<label
							htmlFor="phone"
							className="text-sm font-medium block text-left mb-1"
						>
							TrueMoneyWallet
						</label>
						<input
							type="text"
							id="phone"
							placeholder="หมายเลขโทรศัพท์"
							className="w-full border px-3 py-2 rounded text-sm"
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.target.value)}
						/>
					</div>
				)}
			</div>

			<div className="text-center">
				<button className="bg-black text-white px-6 py-2 rounded hover:opacity-90">
					Proceed
				</button>
			</div>
		</main>
	);
};

export default Payment;
