"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";

import { useSession } from "@/lib/auth-client";

import Step from "@/components/Rental/step";

import Header from "@/components/Header";

const Page = () => {
	const { rentalId } = useParams();
	const session = useSession();

	const [rental, setRental] = useState<any>(null);
	const [item, setItem] = useState<any>(null);
	const [lender, setLender] = useState<any>(null);
	const [renter, setRenter] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchRental = async () => {
			try {
				const rentalResponse = await fetch(`/api/rental/${rentalId}`);
				const rentalData = await rentalResponse.json();
				setRental(rentalData);
				console.log("Fetched:", rentalData);

				const itemResponse = await fetch(
					`/api/item/${rentalData.item_id}`
				);
				const itemData = await itemResponse.json();
				setItem(itemData);

				setLender(itemData.user_info);

				if (session?.data?.user) {
					const userResponse = await fetch(
						`/api/user/info/${session?.data?.user.id}`
					);
					const userData = await userResponse.json();
					setRenter(userData);
				}
			} catch (error) {
				console.error("Error fetching rental data:", error);
				notFound();
			} finally {
				setLoading(false);
			}
		};

		if (rentalId) {
			fetchRental();
		}
	}, [rentalId, session]);

	const formatThaiDate = (d: string) =>
		new Date(d).toLocaleString("th-TH", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});

	if (loading) return <div>Loading...</div>;

	const cancel = async () => {
		try {
			const updatedRental = await fetch(
				`/api/rental/${rentalId}/status`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ status: "cancel" }),
				}
			).then((res) => res.json());

			if (updatedRental) {
				setRental(updatedRental);
				alert("Rental request has been cancelled.");
			}
		} catch (error) {
			console.error("Error cancelling rental:", error);
			alert("Failed to cancel the rental request. Please try again.");
		}
	};

	return (
		<>
			<Header>{Step(2)}</Header>
			<main className="container mx-auto px-16 py-8">
				<div className="mb-10 max-w-xl mx-auto">
					<div
						className={`rounded-lg py-6 px-8 w-full text-center ${
							rental?.status === "accepted"
								? "bg-green-200 text-green-800"
								: "bg-gray-200 text-black"
						}`}
					>
						<p className="text-2xl font-bold">
							{rental?.status === "accepted"
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
					{rental?.status === "accepted" && (
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
								src={`http://localhost:8787/${item.images[0]}`}
								alt={item?.name}
								className="w-14 h-14 rounded-lg object-cover"
							/>
							<div>
								<p className="font-medium text-sm">
									{item?.item_name}
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
							<div className="flex justify-between font-bold border-t pt-2 mt-2">
								<span>รวม</span>
								<span>
									{rental.payment.total_price.toFixed(2)} บาท
								</span>
							</div>
						</div>
					</div>
					<div className="lg:col-span-3 flex flex-col gap-6">
						<div className="flex flex-col md:flex-row gap-6">
							<div className="w-full md:w-2/5 bg-white p-4 shadow rounded-lg space-y-2">
								<h3 className="text-xl font-semibold">
									Lender
								</h3>
								<p>
									ชื่อ-สกุล : {lender?.first_name}{" "}
									{lender?.last_name}
								</p>
								<p>
									ที่อยู่จัดส่ง :{" "}
									{
										item?.user_info.addresses[0]
											.residence_info
									}
									,{" "}
									{item?.user_info.addresses[0].sub_district},{" "}
									{item?.user_info.addresses[0].district},{" "}
									{item?.user_info.addresses[0].province},{" "}
									{item?.user_info.addresses[0].postal_code}
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
								<p>
									ชื่อ-สกุล : {renter?.first_name}{" "}
									{renter?.last_name}
								</p>
								<p>
									ที่อยู่จัดส่ง : {renter?.residence_info},{" "}
									{renter?.sub_district}, {renter?.district},{" "}
									{renter?.province}, {renter?.postal_code}
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
					{rental?.status === "accepted" ? (
						<a
							href={`/rental/payment/${rentalId}`}
							className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:opacity-90"
						>
							Proceed to Payment
						</a>
					) : (
						<button
							onClick={cancel}
							className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:opacity-90"
						>
							Cancel
						</button>
					)}
				</div>
			</main>
		</>
	);
};

export default Page;
