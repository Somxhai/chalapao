"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";

import { Checkbox, Textarea, TextInput } from "flowbite-react";

import { data as rentals } from "@/data/rental";
import { data as items } from "@/data/item";
import { data as itemImages } from "@/data/item_image";
import { data as users } from "@/data/user";
import { data as addresses } from "@/data/address";
import { data as payments } from "@/data/payment";

type Action = { label: string; href?: string; onClick?: () => void };

const toThaiStatus = (rentalStatus: string, paymentStatus?: string): string => {
	switch (rentalStatus) {
		case "Pending":
			return "ขอเช่า";
		case "Active": {
			if (paymentStatus === "Pending") return "ยืนยันคำขอแล้ว";
			if (paymentStatus === "Paid") return "ชำระเงินแล้ว";
			return "ถูกเช่าอยู่";
		}
		case "Returned":
			return "กำลังส่งคืน";
		case "Failed":
			return "ยกเลิก";
		default:
			return "สำเร็จแล้ว";
	}
};

const toActions = (status: string, id: string): Action[] => {
	switch (status) {
		case "ขอเช่า":
			return [
				{ label: "ยืนยันคำขอ", href: `/approve/${id}` },
				{ label: "ปฏิเสธคำขอ", href: `/reject/${id}` },
			];
		case "ยืนยันคำขอแล้ว":
			return [{ label: "รอผู้เช่าชำระเงิน" }];
		case "ชำระเงินแล้ว":
			return [{ label: "ยืนยันการส่ง", href: `/confirm-shipping/${id}` }];
		case "กำลังส่งคืน":
			return [
				{ label: "ยืนยันการส่งคืน", href: `/confirm-return/${id}` },
				{ label: "ระบุค่าปรับ", href: `/penalty/${id}` },
			];
		case "ผู้เช่าชำระค่าปรับแล้ว":
		case "สำเร็จแล้ว":
			return [{ label: "ให้คะแนนผู้เช่า", href: `/rate-renter/${id}` }];
		default:
			return [];
	}
};

const calcDuration = (start?: string, end?: string): string => {
	if (!start || !end) return "-";
	const d1 = new Date(start);
	const d2 = new Date(end);
	const diff = Math.ceil((d2.getTime() - d1.getTime()) / 86_400_000);
	return `${diff} วัน`;
};

const Page = () => {
	const { rentalId } = useParams<{ rentalId: string }>();
	const rental = rentals.find((r) => r.id === rentalId);
	if (!rental) return notFound();
	const item = items.find((i) => i.id === rental.item_id);
	const owner = users.find((u) => u.id === item?.owner_id);
	const renter = users.find((u) => u.id === rental.renter_id);
	const payment = payments.find((p) => p.id === rental.payment_id);
	const renterAddress = addresses.find(
		(a) => a.user_id === renter?.id && a.is_primary
	);
	if (!item || !owner || !renter) return notFound();
	const status = toThaiStatus(rental.status, payment?.status);
	const actions = toActions(status, rental.id);
	const isReturning = status === "กำลังส่งคืน";
	const imageUrl =
		item.item_images?.[0]?.image_url ??
		itemImages.find((img) => img.item_id === item.id)?.image_url ??
		"";
	const shippingFee = 120;
	const rentPrice = payment?.total_price ?? item.price_per_day;
	const totalPrice = rentPrice + shippingFee;
	const duration = calcDuration(rental.start_date, rental.end_date);
	const fullAddress = renterAddress
		? `${renterAddress.residence_info}, ${renterAddress.subdistrict}, ${renterAddress.district}, ${renterAddress.province}, ${renterAddress.postal_code}`
		: "-";
	return (
		<>
			<div className="max-w-6xl mx-auto bg-white rounded-lg p-6 shadow">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2">
						<h2 className="text-3xl font-semibold mb-1">
							{item.name}
						</h2>
						<p className="text-gray-600 mb-6">
							{renter.user_name}{" "}
							<span className="underline text-sm cursor-pointer">
								ดูประวัติผู้เช่า
							</span>
						</p>
						<div className="grid grid-cols-2 gap-4 mb-6 border-b pb-4">
							<div>
								<h3 className="font-bold mb-2">Lender</h3>
								<p>ผู้ให้เช่า : {owner.user_name}</p>
								<p>
									ชื่อ-สกุล : {owner.first_name}{" "}
									{owner.last_name}
								</p>
								<p>
									เบอร์โทร : <b>{owner.phone}</b>
								</p>
							</div>
							<div>
								<h3 className="font-bold mb-2">Renter</h3>
								<p>
									ผู้เช่า : <b>{renter.user_name}</b>
								</p>
								<p>
									ชื่อ-สกุล :{" "}
									<b>
										{renter.first_name} {renter.last_name}
									</b>
								</p>
								<p>
									เบอร์โทร : <b>{renter.phone}</b>
								</p>
								<p>
									ที่อยู่จัดส่ง :<br />
									{fullAddress}
								</p>
							</div>
						</div>
						<div className="mb-6">
							<h3 className="font-bold text-lg mb-2">Renting</h3>
							<p>ระยะเวลาการเช่า : {duration}</p>
							<p>ตั้งแต่วันที่ : {rental.start_date}</p>
							<p>ถึงวันที่ : {rental.end_date}</p>
							<Link
								href="/rental-terms"
								className="underline text-sm inline-block mt-1"
							>
								อ่านเงื่อนไขการเช่า และการปรับ
							</Link>
						</div>
						{isReturning && (
							<div className="mb-6 border-t pt-4">
								<p className="text-red-600 font-semibold mb-2">
									กรุณาตรวจสอบสินค้าโดยละเอียดก่อนยืนยันการรับคืน
								</p>
								<div className="space-y-3">
									<label className="flex items-center gap-2 text-sm">
										<Checkbox /> สินค้าที่ไม่ส่งมา
									</label>
									<label className="flex items-center gap-2 text-sm">
										<Checkbox /> สินค้ามีเสียหาย
									</label>
									<div className="flex items-center gap-2">
										<label className="text-sm">
											ค่าชดเชยสินค้าเสียหาย
										</label>
										<TextInput
											type="number"
											className="w-28"
										/>
										<span>บาท</span>
									</div>
									<label className="text-sm block">
										คำอธิบาย
									</label>
									<Textarea rows={3} />
								</div>
							</div>
						)}
					</div>
					<div className="space-y-4">
						<p className="text-lg font-semibold text-right">
							{status}
						</p>
						<div className="w-full flex justify-center">
							<img
								src={imageUrl}
								alt={item.name}
								className="rounded-lg object-contain w-[200px] h-[200px]"
							/>
						</div>
						<div className="border p-6 rounded-lg shadow mb-2">
							<div className="flex gap-4 mb-2">
								<img
									src={imageUrl}
									alt={item.name}
									className="w-16 h-16 object-cover rounded-lg"
								/>
								<div className="flex-1 text-sm">
									<p className="font-semibold">{item.name}</p>
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
										{rentPrice.toLocaleString()} บาท
									</span>
								</div>
								<div className="flex justify-between">
									<span>ค่าจัดส่ง</span>
									<span>
										{shippingFee.toLocaleString()} บาท
									</span>
								</div>
								<div className="flex justify-between">
									<span>รวม</span>
									<span className="text-lg font-bold">
										{totalPrice.toLocaleString()} บาท
									</span>
								</div>
							</div>
						</div>
						{actions.length > 0 && (
							<div className="flex flex-col gap-3">
								{actions.map((action, i) =>
									action.href ? (
										<Link
											href={action.href}
											key={i}
											className="w-full"
										>
											<button className="w-full bg-gray-700 text-white rounded-lg py-2">
												{action.label}
											</button>
										</Link>
									) : (
										<button
											key={i}
											className="w-full bg-gray-700 text-white rounded-lg py-2"
											onClick={action.onClick}
										>
											{action.label}
										</button>
									)
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Page;
