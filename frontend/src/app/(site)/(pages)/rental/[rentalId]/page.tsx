"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";

import { Button, Card } from "flowbite-react";

import Header from "@/components/Header";
import Links from "@/components/Header/links";

import { data as rentals } from "@/data/rental";
import { data as items } from "@/data/item";
import { data as itemImages } from "@/data/item_image";
import { data as users } from "@/data/user";
import { data as addresses } from "@/data/address";
import { data as payments } from "@/data/payment";

const thaiStatus = (rentalStatus: string, paymentStatus?: string): string => {
	if (rentalStatus === "Pending") return "รอผู้ปล่อยเช่ายืนยัน";
	if (paymentStatus === "Pending") return "ผู้ปล่อยเช่ายืนยันแล้ว";
	if (rentalStatus === "Active") return "เช่าอยู่";
	if (rentalStatus === "Returned") return "จัดส่งคืนแล้ว";
	if (paymentStatus === "Failed") return "มีค่าปรับที่ต้องชำระ";
	if (rentalStatus === "Failed") return "ยกเลิกแล้ว";
	return "เช่าสำเร็จแล้ว";
};

const calcDuration = (start?: string, end?: string): string => {
	if (!start || !end) return "-";
	const d1 = new Date(start);
	const d2 = new Date(end);
	const diffDays = Math.ceil((d2.getTime() - d1.getTime()) / 86_400_000);
	return `${diffDays} วัน`;
};

const Page = () => {
	const { rentalId } = useParams<{ rentalId: string }>();
	const rental = rentals.find((r) => r.id === rentalId);
	const item = items.find((i) => i.id === rental?.item_id);
	const owner = users.find((u) => u.id === item?.owner_id);
	const renter = users.find((u) => u.id === rental?.renter_id);
	const renterAddress = addresses.find(
		(a) => a.user_id === renter?.id && a.is_primary
	);
	const payment = payments.find((p) => p.id === rental?.payment_id);
	const imageUrl =
		item?.item_images?.[0]?.image_url ||
		itemImages.find((img) => img.item_id === item?.id)?.image_url ||
		"";
	if (!rental || !item || !owner || !renter) {
		return notFound();
	}
	const duration = calcDuration(rental.start_date, rental.end_date);
	const statusText = thaiStatus(rental.status, payment?.status);
	const totalPrice = payment?.total_price ?? item.price_per_day;
	const fullDeliveryAddress = renterAddress
		? `${renterAddress.residence_info}, ${renterAddress.subdistrict}, ${renterAddress.district}, ${renterAddress.province}, ${renterAddress.postal_code}`
		: "-";
	return (
		<>
			<Header>
				<Links />
			</Header>
			<main className="container mx-auto px-16 py-8">
				<div className="max-w-6xl mx-auto bg-white rounded-lg p-6 shadow">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<div className="lg:col-span-2">
							<h2 className="text-3xl font-semibold mb-1">
								{item.item_name}
							</h2>
							<p className="text-gray-600 mb-6">
								{owner.user_name}{" "}
								<Link href={`/shop/${owner.user_name}`}>
									<span className="text-blue-600 text-sm underline ml-1 hover:text-blue-800">
										ดูร้านค้า
									</span>
								</Link>
							</p>
							<div className="grid grid-cols-2 gap-4 mb-6 border-b pb-4">
								<div>
									<h3 className="font-bold mb-2">Lender</h3>
									<p>ผู้ให้เช่า : {owner.user_name}</p>
									<p>
										ชื่อ-สกุล : {owner.first_name}{" "}
										{owner.last_name}
									</p>
								</div>
								<div>
									<h3 className="font-bold mb-2">Renter</h3>
									<p>ผู้เช่า : {renter.user_name}</p>
									<p>
										ชื่อ-สกุล : {renter.first_name}{" "}
										{renter.last_name}
									</p>
									<p>ที่อยู่จัดส่ง : {fullDeliveryAddress}</p>
								</div>
							</div>
							<div className="mb-6">
								<h3 className="font-bold text-lg mb-2">
									Renting
								</h3>
								<p>ระยะเวลาการเช่า : {duration}</p>
								<p>ตั้งแต่วันที่ : {rental.start_date}</p>
								<p>ถึงวันที่ : {rental.end_date}</p>
								<Link href="/rental-terms">
									<span className="text-blue-600 underline text-sm mt-2 inline-block hover:text-blue-800">
										อ่านเงื่อนไขการเช่า และการปรับ
									</span>
								</Link>
							</div>
						</div>
						<div className="space-y-4">
							<p className="text-lg font-semibold text-right">
								{statusText}
							</p>
							<div className="w-full flex justify-center">
								<img
									src={imageUrl}
									alt={item.item_name}
									className="rounded-lg object-contain w-[200px] h-[200px]"
								/>
							</div>
							<Card>
								<div className="flex gap-4 mb-2">
									<img
										src={imageUrl}
										alt={item.item_name}
										className="w-16 h-16 object-cover rounded-lg"
									/>
									<div className="flex-1 text-sm">
										<p className="font-semibold">
											{item.item_name}
										</p>
										<p>
											เช่าจาก : {owner.first_name}{" "}
											{owner.last_name}
										</p>
										<p>
											ผู้เช่า : {renter.first_name}{" "}
											{renter.last_name}
										</p>
									</div>
								</div>
								<div className="text-sm text-gray-600">
									<div className="flex justify-between">
										<span>ค่าเช่า {duration}</span>
										<span>
											{item.price_per_day.toLocaleString()}{" "}
											บาท
										</span>
									</div>
									<div className="flex justify-between">
										<span>รวม</span>
										<span className="text-lg font-bold">
											{totalPrice.toLocaleString()} บาท
										</span>
									</div>
								</div>
							</Card>
							<Link href={`/cancel/${rental.id}`}>
								<Button color="gray" className="w-full">
									ยกเลิก
								</Button>
							</Link>
						</div>
					</div>
					<div className="mt-6 text-center">
						<Link href="/rentals">
							<Button color="light">
								ย้อนกลับไปหน้ารายการเช่า
							</Button>
						</Link>
					</div>
				</div>
			</main>
		</>
	);
};

export default Page;
