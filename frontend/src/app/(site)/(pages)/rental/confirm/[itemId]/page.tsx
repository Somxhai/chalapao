"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

import Step from "@/components/Rental/step";
import Header from "@/components/Header";

import { ItemType } from "@/types/item";
import { UserType } from "@/types/user";
import { useSession } from "@/lib/auth-client";

const Page = () => {
	const { itemId } = useParams();

	const session = useSession();

	const [item, setItem] = useState<ItemType>();
	const [images, setImages] = useState<string[]>([]);
	const [ownerInfo, setOwnerInfo] = useState<UserType>();
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<UserType>();
	const [startDate, setStartDate] = useState<Date>();
	const [endDate, setEndDate] = useState<Date>();
	const [total, setTotal] = useState<number>(0);

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
				} catch (error) {
					console.error("Error fetching user info:", error);
				}
			};

			fetchUser();
		}
	}, [session]);

	const formatDate = (d: string) =>
		new Date(d).toLocaleString("en-US", {
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
				setItem(data.item);
				setImages(data.images);
				setOwnerInfo(data.owner_info);
				if (startDateParam && endDateParam) {
					const startDate = new Date(startDateParam);
					const endDate = new Date(endDateParam);
					const totalPrice = parseFloat(
						(
							(data?.item.price_per_day *
								(endDate.getTime() - startDate.getTime())) /
							(1000 * 3600 * 24)
						).toFixed(2)
					);
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
			alert(
				"Please accept the terms and conditions before submitting the rental request."
			);
			return;
		}

		if (!item || !user || !startDate || !endDate) {
			alert(
				"Incomplete information. Please select dates and verify the details."
			);
			return;
		}

		try {
			const rental = {
				item_id: item.id,
				renter_id: user.id,
				status: "pending",
				start_date: startDate,
				end_date: endDate,
			};

			const delivery_address = {
				residence_info: user.address.residence_info,
				sub_district: user.address.sub_district,
				district: user.address.district,
				province: user.address.province,
				postal_code: user.address.postal_code,
				type: "delivery",
			};

			const return_address = {
				residence_info: ownerInfo?.address.residence_info || "",
				sub_district: ownerInfo?.address.sub_district || "",
				district: ownerInfo?.address.district || "",
				province: ownerInfo?.address.province || "",
				postal_code: ownerInfo?.address.postal_code || "",
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
			window.location.href = `/rental/pending/${data.id}`;
		} catch (error) {
			console.error("Error creating rental:", error);
			alert("Unable to submit the rental request. Please try again.");
		}
	};

	return (
		<>
			<Header>{Step(1)}</Header>
			<main className="container mx-auto px-16 py-8">
				<div className="flex gap-10 flex-col lg:flex-row">
					<div className="flex flex-col w-full lg:w-1/3 gap-2 mt-8">
						<Image
							className="rounded-t-lg aspect-square w-full object-cover"
							src={`/api/${images[0]}`}
							width={500}
							height={500}
							alt={item?.item_name || ""}
						/>
						<h3 className="text-xl font-semibold">
							{item?.item_name}
						</h3>
						<p className="text-sm text-gray-500">
							Item Description: {item?.description}
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
										Name: {ownerInfo?.first_name}{" "}
										{ownerInfo?.last_name}
									</p>
									<p>
										Return Address:{" "}
										{ownerInfo?.address.residence_info},{" "}
										{ownerInfo?.address.sub_district},{" "}
										{ownerInfo?.address.district},{" "}
										{ownerInfo?.address.province},{" "}
										{ownerInfo?.address.postal_code}
									</p>
								</div>
							</div>
							<div className="flex flex-col w-1/2 gap-1">
								<h3 className="text-xl font-semibold">
									Renter
								</h3>
								<div className="border p-4 rounded-lg space-y-2 text-sm bg-white shadow">
									<p>
										Name: {user?.first_name}{" "}
										{user?.last_name}
									</p>
									<p>
										Delivery Address:{" "}
										{user?.address.residence_info},{" "}
										{user?.address.sub_district},{" "}
										{user?.address.district},{" "}
										{user?.address.province},{" "}
										{user?.address.postal_code}
									</p>
								</div>
							</div>
						</div>
						<div className="flex flex-col w-full gap-1">
							<h3 className="text-xl font-semibold">Renting</h3>
							<div className="border p-4 rounded-lg space-y-2 text-sm bg-white shadow">
								<p>
									From Date:{" "}
									{formatDate(startDate?.toISOString() || "")}
								</p>
								<p>
									To Date:{" "}
									{formatDate(endDate?.toISOString() || "")}
								</p>
								<p>Rental Terms: {item?.rental_terms}</p>
								<p>Penalty Terms: {item?.penalty_terms}</p>
								<div className="flex justify-between font-bold border-t pt-2">
									<span>Total</span>
									<span>{total} THB</span>
								</div>
								<div className="mt-4 space-y-2 text-sm">
									<div>
										<input
											id="terms"
											type="checkbox"
											className="mr-2"
										/>
										<label htmlFor="terms">
											Accept rental terms and conditions
										</label>
									</div>
									<div>
										<input
											id="condition"
											type="checkbox"
											className="mr-2"
										/>
										<label htmlFor="condition">
											Accept penalty terms and conditions
										</label>
									</div>
								</div>
							</div>
						</div>
						<div className="flex justify-end">
							<button
								onClick={createRental}
								className="bg-gray-700 text-white px-6 py-2 rounded-lg"
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
