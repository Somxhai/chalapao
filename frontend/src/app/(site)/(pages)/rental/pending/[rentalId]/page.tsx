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

const Page = () => {
	const { rentalId } = useParams();
	const rental = rentals.find((r) => r.id === rentalId);
	const item = items.find((i) => i.id === rental?.item_id);
	const lender = users.find((u) => u.id === item?.owner_id);
	const renter = users.find((u) => u.id === rental?.renter_id);
	const image = item?.item_images?.[0];

	const formatThaiDate = (d: string) =>
		new Date(d).toLocaleString("th-TH", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});

	return (
		<>
			<Header>{Step(2)}</Header>
			<main className="container mx-auto px-16 py-8">
				<div className="mb-10 max-w-xl mx-auto">
					<div
						className={`rounded-lg py-6 px-8 w-full text-center ${
							rental?.status === "Active"
								? "bg-green-200 text-green-800"
								: "bg-gray-200 text-black"
						}`}
					>
						<p className="text-2xl font-bold">
							{rental?.status === "Active"
								? "ผู้ปล่อยเช่ายืนยันเรียบร้อยแล้ว"
								: "กรุณารอผู้ปล่อยเช่ายืนยัน"}
						</p>
					</div>
					<p className="text-sm mt-4 text-center">
						ส่งคำขอเช่าเมื่อ :{" "}
						<span className="font-semibold">
							{formatThaiDate(rental?.created_at ?? "")}
						</span>
					</p>
					{rental?.status === "Active" && (
						<p className="text-sm text-center">
							ยืนยันการเช่าแล้วเมื่อ :{" "}
							<span className="font-semibold">
								{formatThaiDate(rental?.updated_at)}
							</span>
						</p>
					)}
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
					<div className="lg:col-span-2 bg-white p-4 shadow rounded-lg space-y-4 w-full">
						<h3 className="text-xl font-semibold">Rental</h3>
						<div className="flex items-center gap-3">
							<img
								src={image?.image_url || "/camera.png"}
								alt={item?.name}
								className="w-14 h-14 rounded-lg object-cover"
							/>
							<div>
								<p className="font-medium text-sm">
									{item?.name}
								</p>
								<p className="text-xs text-gray-500">
									เช่าจาก : {renter?.first_name}{" "}
									{renter?.last_name}
								</p>
								<p className="text-xs text-gray-500">
									ผู้ให้เช่า : {lender?.first_name}{" "}
									{lender?.last_name}
								</p>
							</div>
						</div>
						<div className="text-sm">
							<div className="flex justify-between">
								<span>ค่าเช่า 1 เดือน</span>
								<span>
									{item ? item.price_per_day * 30 : 0} บาท
								</span>
							</div>
							<p className="text-xs text-gray-500 mt-2">
								ทางไปรษณีย์ไทย ไปที่อยู่:{" "}
								{rental?.delivery_residence_info}
							</p>
							<div className="flex justify-between font-bold border-t pt-2 mt-2">
								<span>รวม</span>
								<span>{item?.price_per_day * 30} บาท</span>
							</div>
						</div>
					</div>
					<div className="lg:col-span-3 flex flex-col gap-6">
						<div className="flex flex-col md:flex-row gap-6">
							<div className="w-full md:w-2/5 bg-white p-4 shadow rounded-lg space-y-2">
								<h3 className="text-xl font-semibold">
									Lender
								</h3>
								<p>ผู้ให้เช่า : {lender?.user_name}</p>
								<p>
									ชื่อ-สกุล : {lender?.first_name}{" "}
									{lender?.last_name}
								</p>
							</div>
							<div className="w-full md:w-3/5 bg-white p-4 shadow rounded-lg space-y-2">
								<div className="flex justify-between items-start">
									<h3 className="text-xl font-semibold">
										Renter
									</h3>
									<span className="text-xs underline text-blue-500 cursor-pointer">
										แก้ไข/เลือกที่อยู่จัดส่ง
									</span>
								</div>
								<p>ผู้เช่า : {renter?.user_name}</p>
								<p>
									ชื่อ-สกุล : {renter?.first_name}{" "}
									{renter?.last_name}
								</p>
								<p>
									ที่อยู่จัดส่ง :{" "}
									{rental?.delivery_residence_info}
								</p>
							</div>
						</div>
						<div className="bg-white p-4 shadow rounded-lg space-y-2">
							<h3 className="text-xl font-semibold">Renting</h3>
							<p>ระยะเวลาการเช่า : 1 เดือน</p>
							<p>
								ตั้งแต่วันที่ :{" "}
								{formatThaiDate(rental?.start_date ?? "")}
							</p>
							<p>
								ถึงวันที่ :{" "}
								{formatThaiDate(rental?.end_date ?? "")}
							</p>
						</div>
					</div>
				</div>
				<div className="flex justify-end mt-6">
					<button className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:opacity-90">
						Cancel
					</button>
				</div>
			</main>
		</>
	);
};

export default Page;
