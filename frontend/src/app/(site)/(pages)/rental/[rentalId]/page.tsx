"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";

import { Button, Card } from "flowbite-react";

import Header from "@/components/Header";
import Links from "@/components/Header/links";

const thaiStatus = (rentalStatus: string, paymentStatus?: string): string => {
	if (rentalStatus === "pending") return "รอผู้ปล่อยเช่ายืนยัน";
	if (rentalStatus === "accepted" && paymentStatus === "pending")
		return "ผู้ปล่อยเช่ายืนยันแล้ว";
	if (rentalStatus === "accepted" && paymentStatus === "completed")
		return "เช่าอยู่";
	if (rentalStatus === "cancel") return "ยกเลิกแล้ว";
	if (paymentStatus === "failed") return "มีค่าปรับที่ต้องชำระ";
	if (rentalStatus === "completed") return "เช่าสำเร็จแล้ว";
	return "ไม่ทราบสถานะ";
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
	const [rental, setRental] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchRental = async () => {
			try {
				const response = await fetch(`/api/rental/${rentalId}`);
				if (!response.ok) throw new Error("ไม่พบข้อมูลเช่า");
				const data = await response.json();
				setRental(data);
				console.log("Fetched rental:", data);
			} catch (error) {
				console.error("Error fetching rental:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchRental();
	}, [rentalId]);

	if (loading) return <div className="text-center py-20">Loading...</div>;
	if (!rental) return notFound();

	const {
		item,
		renter_info,
		lessor_info,
		delivery_address_info,
		return_address_info,
		payment,
	} = rental;
	const duration = calcDuration(rental.start_date, rental.end_date);
	const statusText = thaiStatus(rental.status, payment?.status);
	const fullDeliveryAddress = delivery_address_info
		? `${delivery_address_info.residence_info}, ${delivery_address_info.sub_district}, ${delivery_address_info.district}, ${delivery_address_info.province}, ${delivery_address_info.postal_code}`
		: "-";
	const fullReturnAddress = return_address_info
		? `${return_address_info.residence_info}, ${return_address_info.sub_district}, ${return_address_info.district}, ${return_address_info.province}, ${return_address_info.postal_code}`
		: "-";

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
								{lessor_info.first_name} {lessor_info.last_name}
								<Link href={`/shop/${lessor_info.first_name}`}>
									<span className="text-blue-600 text-sm underline ml-1 hover:text-blue-800">
										ดูร้านค้า
									</span>
								</Link>
							</p>
							<div className="grid grid-cols-2 gap-4 mb-6 border-b pb-4">
								<div>
									<h3 className="font-bold mb-2">Lender</h3>
									<p>
										ผู้ให้เช่า : {lessor_info.first_name}{" "}
										{lessor_info.last_name}
									</p>
									<p>
										ที่อยู่จัดส่งคืน : {fullReturnAddress}
									</p>
								</div>
								<div>
									<h3 className="font-bold mb-2">Renter</h3>
									<p>
										ผู้เช่า : {renter_info.first_name}{" "}
										{renter_info.last_name}
									</p>
									<p>ที่อยู่จัดส่ง : {fullDeliveryAddress}</p>
								</div>
							</div>

							<div className="mb-6">
								<h3 className="font-bold text-lg mb-2">
									Renting
								</h3>
								<p>ระยะเวลาการเช่า : {duration}</p>
								<p>
									ตั้งแต่วันที่ :{" "}
									{formatThaiDate(rental.start_date)}
								</p>
								<p>
									ถึงวันที่ :{" "}
									{formatThaiDate(rental.end_date)}
								</p>
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
									className="rounded-lg object-contain w-[200px] h-[200px]"
									src={`http://localhost:8787/${rental?.item.images[0]}`}
									alt={rental?.sname}
								/>
							</div>

							<Card>
								<div className="flex gap-4 mb-2">
									<img
										className="w-16 h-16 object-cover rounded-lg"
										src={`http://localhost:8787/${rental?.item.images[0]}`}
										alt={rental?.sname}
									/>
									<div className="flex-1 text-sm">
										<p className="font-semibold">
											{item.item_name}
										</p>
										<p>
											เช่าจาก : {lessor_info.first_name}{" "}
											{lessor_info.last_name}
										</p>
										<p>
											ผู้เช่า : {renter_info.first_name}{" "}
											{renter_info.last_name}
										</p>
									</div>
								</div>

								<div className="text-sm text-gray-600">
									<div className="flex justify-between">
										<span>ค่าเช่า {duration}</span>
										<span className="text-lg font-bold">
											{payment.total_price} บาท
										</span>
									</div>
								</div>
							</Card>
						</div>
					</div>

					<div className="flex justify-between mt-6 text-center">
						<Link href="/rentals">
							<Button color="light">
								ย้อนกลับไปหน้ารายการเช่า
							</Button>
						</Link>
						<Link href={`/item/review/${item.id}`}>
							<Button color="gray">รีวิวสินค้า</Button>
						</Link>
					</div>
				</div>
			</main>
		</>
	);
};

export default Page;
