"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";

import Step from "@/components/Rental/step";
import Header from "@/components/Header";

import { ItemType } from "@/types/item";

const Page = () => {
	const { itemId } = useParams();
	// const item = items.find((i) => i.id === itemId);
	// const lender = users.find((u) => u.id === item?.owner_id);
	// const renter = users.find((u) => u.user_type === "renter");
	// const image = itemImages.find((img) => img.item_id === item?.id);
	// const address = renter?.address.find((addr) => addr.is_primary);

	const [item, setItem] = useState<ItemType>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!itemId) {
			console.error("Item ID is missing");
			return;
		}

		const fetchItems = async () => {
			try {
				const response = await fetch(`/api/item/${itemId}`);
				if (!response.ok) {
					throw new Error("Failed to fetch item");
				}
				const data = await response.json();
				setItem(data);
				console.log("Fetched item:", data);
			} catch (error) {
				console.error("Error fetching items:", error);
			} finally {
				setLoading(false);
			}
		};

		const fetchReviews = async () => {
			try {
				const response = await fetch(`/api/review/item/${itemId}`);
				if (!response.ok) {
					throw new Error("Failed to fetch reviews");
				}
				const data = await response.json();
				setItem((prevItem) => {
					if (!prevItem) return undefined; // Ensure prevItem is defined
					return {
						...prevItem,
						item_reviews: data, // Use the fetched data for reviews
					};
				});
				console.log("Fetched reviews:", data);
			} catch (error) {
				console.error("Error fetching reviews:", error);
			}
		};

		fetchItems();
		fetchReviews();
	}, [itemId]);

	if (loading) return <div>Loading...</div>;

	if (!item) return notFound();

	return (
		<>
			<Header>{Step(1)}</Header>
			<main className="container mx-auto px-16 py-8">
				<div className="flex gap-10 flex-col lg:flex-row">
					<div className="flex flex-col w-full lg:w-1/3 gap-1">
						{/* <img
							src={image?.image_url || "/camera.png"}
							alt={item?.name || "Product"}
							className="rounded-lg mt-8 mb-4 shadow"
						/> */}
						<h3 className="text-xl font-semibold">{item?.name}</h3>
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
									{/* <p>ผู้ให้เช่า : {lender?.user_name}</p> */}
									<p>
										{/* ชื่อ-สกุล : {lender?.first_name}{" "} */}
										{/* {lender?.last_name} */}
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
									{/* <p>ผู้เช่า : {renter?.user_name}</p> */}
									<p>
										{/* ชื่อ-สกุล : {renter?.first_name}{" "} */}
										{/* {renter?.last_name} */}
									</p>
									<p>
										ที่อยู่จัดส่ง :{" "}
										{/* {address?.residence_info || "ที่อยู่"} */}
									</p>
								</div>
							</div>
						</div>
						<div className="flex flex-col w-full gap-1">
							<h3 className="text-xl font-semibold">Renting</h3>
							<div className="border p-4 rounded-lg space-y-2 text-sm bg-white shadow">
								<p>ตั้งแต่วันที่ : 22 มีนาคม 2568</p>
								<p>ถึงวันที่ : 22 เมษายน 2568</p>
								<p>
									เงื่อนไขและข้อตกลงการเช่า :{" "}
									{item?.rental_terms}
								</p>
								<p>
									เงื่อนไขและข้อตกลงการปรับ :{" "}
									{item?.penalty_terms}
								</p>
							</div>
						</div>
						<div className="flex flex-col w-full gap-1">
							<h3 className="text-xl font-semibold">
								Rental Fee
							</h3>
							<div className="border p-4 rounded-lg space-y-2 text-sm bg-white shadow">
								<div className="flex items-center gap-2">
									{/* <img
										src={image?.image_url || "/camera.png"}
										alt={item?.name || "Thumb"}
										width={60}
										height={60}
										className="rounded"
									/> */}
									<p>{item?.name}</p>
									<p className="text-xs text-gray-500">
										{/* ผู้ให้เช่า : {lender?.first_name}{" "} */}
										{/* {lender?.last_name} */}
									</p>
								</div>
								<div className="text-xs text-gray-500">
									ไปที่ผู้เช่า :{" "}
									{/* {address?.residence_info || "ที่อยู่"} */}
								</div>
								<div className="flex justify-between font-bold border-t pt-2">
									<span>รวม</span>
									<span>{item?.price_per_day} บาท</span>
								</div>
								<div className="mt-4 space-y-2 text-sm">
									<div>
										<input
											type="checkbox"
											className="mr-2"
										/>
										<span>
											ยอมรับเงื่อนไขและข้อตกลงในการเช่า
										</span>
									</div>
									<div>
										<input
											type="checkbox"
											className="mr-2"
										/>
										<span>
											ยอมรับเงื่อนไขและข้อตกลงในการปรับ
										</span>
									</div>
								</div>
							</div>
						</div>
						<div className="flex justify-end">
							<button className="bg-black text-white px-6 py-2 rounded-lg hover:opacity-90">
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
