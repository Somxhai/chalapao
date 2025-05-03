"use client";

import { useState, useEffect, use } from "react";
import { useParams, notFound } from "next/navigation";

import Step from "@/components/Rental/step";
import Header from "@/components/Header";

import { ItemType } from "@/types/item";
import { useSession } from "@/lib/auth-client";

const Page = () => {
	const { itemId } = useParams();

	const session = useSession();

	const [item, setItem] = useState<any>();
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<any>(null);
	const [startDate, setStartDate] = useState<Date>();
	const [endDate, setEndDate] = useState<Date>();
	const [total, setTotal] = useState<any>(0);

	useEffect(() => {
		if (session?.data?.user) {
			const fetchUser = async () => {
				try {
					const response = await fetch(
						`/api/user/info/${session?.data?.user.id}`
					);
					if (!response.ok) {
						throw new Error("Failed to fetch user info");
					}
					const data = await response.json();
					setUser(data);
					console.log("Fetched user:", data);
				} catch (error) {
					console.error("Error fetching user info:", error);
				}
			};

			fetchUser();
		}
	}, [session]);

	const formatThaiDate = (d: string) =>
		new Date(d).toLocaleString("th-TH", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});

	useEffect(() => {
		const fetchItems = async () => {
			try {
				const response = await fetch(`/api/item/${itemId}`);
				if (!response.ok) {
					throw new Error("Failed to fetch item");
				}
				const data = await response.json();
				setItem(data);
				console.log("Fetched item:", data);
				if (startDateParam && endDateParam) {
					const startDate = new Date(startDateParam);
					const endDate = new Date(endDateParam);
					const totalPrice = (
						(data?.price_per_day *
							(endDate.getTime() - startDate.getTime())) /
						(1000 * 3600 * 24)
					).toFixed(2);
					setTotal(totalPrice);
				}
			} catch (error) {
				console.error("Error fetching items:", error);
			}
		};

		const queryParams = new URLSearchParams(window.location.search);
		const startDateParam = queryParams.get("startDate");
		const endDateParam = queryParams.get("endDate");

		if (startDateParam) {
			setStartDate(new Date(startDateParam));
		}

		if (endDateParam) {
			setEndDate(new Date(endDateParam));
		}

		fetchItems();
	}, [itemId]);

	useEffect(() => {
		if (item && user) setLoading(false);
	}, [item, user]);

	if (loading) return <div>Loading...</div>;

	const createRental = async () => {
		const termsCheckbox = document.getElementById(
			"terms"
		) as HTMLInputElement;
		const conditionCheckbox = document.getElementById(
			"condition"
		) as HTMLInputElement;

		if (!termsCheckbox.checked || !conditionCheckbox.checked) {
			alert("กรุณายอมรับเงื่อนไขและข้อตกลงก่อนส่งคำขอเช่า");
			return;
		}

		if (!item || !user || !startDate || !endDate) {
			alert("ข้อมูลไม่ครบ กรุณาเลือกวันที่ และตรวจสอบข้อมูลอีกครั้ง");
			return;
		}

		try {
			const rental = {
				item_id: item.id,
				renter_id: user.user_id,
				status: "pending",
				start_date: startDate,
				end_date: endDate,
			};

			const delivery_address = {
				residence_info: user.residence_info,
				sub_district: user.sub_district,
				district: user.district,
				province: user.province,
				postal_code: user.postal_code,
				type: "delivery", // ต้องมี type ตาม backend ต้องการ
			};

			const return_address = {
				residence_info:
					item.user_info.addresses[0]?.residence_info || "",
				sub_district: item.user_info.addresses[0]?.sub_district || "",
				district: item.user_info.addresses[0]?.district || "",
				province: item.user_info.addresses[0]?.province || "",
				postal_code: item.user_info.addresses[0]?.postal_code || "",
				type: "return",
			};

			const response = await fetch("/api/rental", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					rental,
					delivery_address,
					return_address,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create rental");
			}

			const data = await response.json();
			console.log("Rental created:", data);
			window.location.href = `/rental/pending/${data.id}`;
		} catch (error) {
			console.error("Error creating rental:", error);
			alert("ไม่สามารถส่งคำขอเช่าได้ กรุณาลองใหม่อีกครั้ง");
		}
	};

	return (
		<>
			<Header>{Step(1)}</Header>
			<main className="container mx-auto px-16 py-8">
				<div className="flex gap-10 flex-col lg:flex-row">
					<div className="flex flex-col w-full lg:w-1/3 gap-2 mt-8">
						<img
							className="rounded-t-lg aspect-square w-full object-cover"
							src={`http://localhost:8787/${item?.images[0]}`}
							alt={item?.item_name}
						/>
						<h3 className="text-xl font-semibold">
							{item?.item_name}
						</h3>
						<p className="text-sm text-gray-500">
							รายละเอียดสินค้า : {item?.description}
						</p>
					</div>
					<div className="flex flex-col gap-4 w-full lg:w-2/3">
						<div className="flex gap-6">
							<div className="flex flex-col w-1/2 gap-1">
								<h3 className="text-xl font-semibold">
									Lender
								</h3>
								<div className="border p-4 rounded-lg space-y-2 text-sm bg-white shadow">
									<p>
										ชื่อ-สกุล : {item?.user_info.first_name}{" "}
										{item?.user_info.last_name}
									</p>
									<p>
										ที่อยู่จัดส่ง :{" "}
										{
											item?.user_info.addresses[0]
												.residence_info
										}
										,{" "}
										{
											item?.user_info.addresses[0]
												.sub_district
										}
										,{" "}
										{item?.user_info.addresses[0].district},{" "}
										{item?.user_info.addresses[0].province},{" "}
										{
											item?.user_info.addresses[0]
												.postal_code
										}
									</p>
								</div>
							</div>
							<div className="flex flex-col w-1/2 gap-1">
								<h3 className="text-xl font-semibold">
									Renter{" "}
									<span className="text-xs underline text-blue-500 cursor-pointer">
										แก้ไข/เลือกที่อยู่จัดส่ง
									</span>
								</h3>
								<div className="border p-4 rounded-lg space-y-2 text-sm bg-white shadow">
									<p>
										ชื่อ-สกุล : {user?.first_name}{" "}
										{user?.last_name}
									</p>
									<p>
										ที่อยู่จัดส่ง : {user?.residence_info},{" "}
										{user?.sub_district}, {user?.district},{" "}
										{user?.province}, {user?.postal_code}
									</p>
								</div>
							</div>
						</div>
						<div className="flex flex-col w-full gap-1">
							<h3 className="text-xl font-semibold">Renting</h3>
							<div className="border p-4 rounded-lg space-y-2 text-sm bg-white shadow">
								<p>
									ตั้งแต่วันที่ :{" "}
									{formatThaiDate(
										startDate?.toISOString() || ""
									)}
								</p>
								<p>
									ถึงวันที่ :{" "}
									{formatThaiDate(
										endDate?.toISOString() || ""
									)}
								</p>
								<p>
									เงื่อนไขและข้อตกลงการเช่า :{" "}
									{item?.rental_terms}
								</p>
								<p>
									เงื่อนไขและข้อตกลงการปรับ :{" "}
									{item?.penalty_terms}
								</p>
								<div className="flex justify-between font-bold border-t pt-2">
									<span>รวม</span>
									<span>{total} บาท</span>
								</div>
								<div className="mt-4 space-y-2 text-sm">
									<div>
										<input
											id="terms"
											type="checkbox"
											className="mr-2"
										/>
										<label htmlFor="terms">
											ยอมรับเงื่อนไขและข้อตกลงในการเช่า
										</label>
									</div>
									<div>
										<input
											id="condition"
											type="checkbox"
											className="mr-2"
										/>
										<label htmlFor="condition">
											ยอมรับเงื่อนไขและข้อตกลงในการปรับ
										</label>
									</div>
								</div>
							</div>
						</div>
						<div className="flex justify-end">
							<button
								onClick={createRental}
								className="bg-black text-white px-6 py-2 rounded-lg hover:opacity-90"
							>
								Submit Request
							</button>
						</div>
					</div>
				</div>
			</main>
		</>
	);
};

export default Page;
