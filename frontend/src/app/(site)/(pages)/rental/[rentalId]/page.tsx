"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";

import { Button, Card } from "flowbite-react";

import Header from "@/components/Header";
import Links from "@/components/Header/links";

const englishStatus = (
	rentalStatus: string,
	paymentStatus?: string
): string => {
	if (rentalStatus === "pending") return "Waiting for lender confirmation";
	if (rentalStatus === "accepted" && paymentStatus === "pending")
		return "Lender confirmed";
	if (rentalStatus === "accepted" && paymentStatus === "completed")
		return "Currently renting";
	if (rentalStatus === "cancel") return "Cancelled";
	if (paymentStatus === "failed") return "Outstanding payment required";
	if (rentalStatus === "completed") return "Rental completed";
	return "Unknown status";
};

const calcDuration = (start?: string, end?: string): string => {
	if (!start || !end) return "-";
	const d1 = new Date(start);
	const d2 = new Date(end);
	const diffDays = Math.ceil((d2.getTime() - d1.getTime()) / 86_400_000);
	return `${diffDays} days`;
};

const Page = () => {
	const { rentalId } = useParams<{ rentalId: string }>();
	const [rental, setRental] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchRental = async () => {
			try {
				const response = await fetch(`/api/rental/${rentalId}`);
				if (!response.ok) throw new Error("Rental data not found");
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
		payment,
		delivery_address,
		return_address,
		rental: rentalInfo,
	} = rental;

	const duration = calcDuration(rentalInfo.start_date, rentalInfo.end_date);
	const statusText = englishStatus(rentalInfo.status, payment?.status);

	const fullDeliveryAddress = delivery_address
		? `${delivery_address.residence_info}, ${delivery_address.sub_district}, ${delivery_address.district}, ${delivery_address.province}, ${delivery_address.postal_code}`
		: "-";

	const fullReturnAddress = return_address
		? `${return_address.residence_info}, ${return_address.sub_district}, ${return_address.district}, ${return_address.province}, ${return_address.postal_code}`
		: "-";

	const formatEnglishDate = (d: string) =>
		new Date(d).toLocaleString("en-US", {
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
								<span className="text-blue-600 text-sm underline ml-1 hover:text-blue-800">
									View store
								</span>
							</p>

							<div className="grid grid-cols-2 gap-4 mb-6 border-b pb-4">
								<div>
									<h3 className="font-bold mb-2">Lender</h3>
									<p>
										Lender: {lessor_info.first_name}{" "}
										{lessor_info.last_name}
									</p>
									<p>Return address: {fullReturnAddress}</p>
								</div>
								<div>
									<h3 className="font-bold mb-2">Renter</h3>
									<p>
										Renter: {renter_info.first_name}{" "}
										{renter_info.last_name}
									</p>
									<p>
										Delivery address: {fullDeliveryAddress}
									</p>
								</div>
							</div>

							<div className="mb-6">
								<h3 className="font-bold text-lg mb-2">
									Renting Details
								</h3>
								<p>Rental duration: {duration}</p>
								<p>
									Start date:{" "}
									{formatEnglishDate(rentalInfo.start_date)}
								</p>
								<p>
									End date:{" "}
									{formatEnglishDate(rentalInfo.end_date)}
								</p>
								<span className="text-blue-600 underline text-sm mt-2 inline-block hover:text-blue-800">
									Read rental terms and penalties
								</span>
							</div>
						</div>

						<div className="space-y-4">
							<p className="text-lg font-semibold text-right">
								{statusText}
							</p>

							<div className="w-full flex justify-center">
								<img
									className="rounded-lg object-contain w-[200px] h-[200px]"
									src={`http://localhost:8787/${item.images[0]}`}
									alt={item.item_name}
								/>
							</div>

							<Card>
								<div className="flex gap-4 mb-2">
									<img
										className="w-16 h-16 object-cover rounded-lg"
										src={`http://localhost:8787/${item.images[0]}`}
										alt={item.item_name}
									/>
									<div className="flex-1 text-sm">
										<p className="font-semibold">
											{item.item_name}
										</p>
										<p>
											Rented from:{" "}
											{lessor_info.first_name}{" "}
											{lessor_info.last_name}
										</p>
										<p>
											Renter: {renter_info.first_name}{" "}
											{renter_info.last_name}
										</p>
									</div>
								</div>

								<div className="text-sm text-gray-600">
									<div className="flex justify-between">
										<span>Rental fee {duration}</span>
										<span className="text-lg font-bold">
											{payment.total_price} THB
										</span>
									</div>
								</div>
							</Card>
						</div>
					</div>

					<div className="flex justify-between mt-6 text-center">
						<Link href="/rentals">
							<Button color="light">Back to rentals</Button>
						</Link>
						<Link href={`/item/review/${item.id}`}>
							<Button color="gray">Review item</Button>
						</Link>
					</div>
				</div>
			</main>
		</>
	);
};

export default Page;
