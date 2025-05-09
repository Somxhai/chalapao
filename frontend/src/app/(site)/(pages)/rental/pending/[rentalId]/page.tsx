"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";

import Step from "@/components/Rental/step";

import Header from "@/components/Header";

import { ItemType } from "@/types/item";
import { UserType } from "@/types/user";
import { RentalType } from "@/types/rental";
import { PaymentType } from "@/types/payment";

const Page = () => {
	const { rentalId } = useParams();

	const [rental, setRental] = useState<RentalType>();
	const [payment, setPayment] = useState<PaymentType>();
	const [item, setItem] = useState<ItemType>();
	const [lessor, setLessor] = useState<UserType>();
	const [renter, setRenter] = useState<UserType>();

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchRental = async () => {
			try {
				const response = await fetch(`/api/rental/${rentalId}`);
				const data = await response.json();

				if (!data?.rental) {
					throw new Error("Invalid rental data structure");
				}

				setRental(data.rental);
				setPayment(data.payment);
				setItem(data.item);
				setLessor(data.lessor_info);
				setRenter(data.renter_info);
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
	}, [rentalId]);

	const formatDate = (d: string) =>
		new Date(d).toLocaleString("en-US", {
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
					body: JSON.stringify({ status: "cancelled" }),
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
							rental?.status === "approved"
								? "bg-green-200 text-green-800"
								: "bg-gray-200 text-black"
						}`}
					>
						<p className="text-2xl font-bold">
							{rental?.status === "approved"
								? "Rental request approved"
								: "Waiting for lessor approval"}
						</p>
					</div>
					<p className="text-sm mt-4 text-center">
						Request sent on:{" "}
						<span className="font-semibold">
							{formatDate(rental?.created_at ?? "")}
						</span>
					</p>
					{rental?.status === "approved" && (
						<p className="text-sm text-center">
							Approved on:{" "}
							<span className="font-semibold">
								{formatDate(rental?.updated_at)}
							</span>
						</p>
					)}
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
					<div className="lg:col-span-2 bg-white p-4 shadow rounded-lg space-y-4 w-full">
						<h3 className="text-xl font-semibold">Rental</h3>
						<div className="flex gap-4 items-center">
							<img
								src={`http://localhost:8787/${item?.images[0]}`}
								alt={item?.item_name}
								className="w-20 h-20 rounded-lg object-cover"
							/>
							<div>
								<p className="font-medium text-sm">
									{item?.item_name}
								</p>
								<p className="text-xs text-gray-500">
									Rented by: {renter?.first_name}{" "}
									{renter?.last_name}
								</p>
								<p className="text-xs text-gray-500">
									Lessor: {lessor?.first_name}{" "}
									{lessor?.last_name}
								</p>
							</div>
						</div>
						<div className="text-sm">
							<div className="flex justify-between font-bold border-t pt-2 mt-2">
								<span>Total</span>
								<span>{payment?.total_price} THB</span>
							</div>
						</div>
					</div>
					<div className="lg:col-span-3 flex flex-col gap-6">
						<div className="flex flex-col md:flex-row gap-6">
							<div className="w-full md:w-2/5 bg-white p-4 shadow rounded-lg space-y-2">
								<h3 className="text-xl font-semibold">
									Lessor
								</h3>
								<p>
									Name: {lessor?.first_name}{" "}
									{lessor?.last_name}
								</p>
								<p>
									Shipping Address:{" "}
									{lessor?.address.residence_info},{" "}
									{lessor?.address.sub_district},{" "}
									{lessor?.address.district},{" "}
									{lessor?.address.province},{" "}
									{lessor?.address.postal_code}
								</p>
							</div>
							<div className="w-full md:w-3/5 bg-white p-4 shadow rounded-lg space-y-2">
								<div className="flex justify-between items-start">
									<h3 className="text-xl font-semibold">
										Renter
									</h3>
									<span className="text-xs underline text-blue-500 cursor-pointer">
										Edit/Select Shipping Address
									</span>
								</div>
								<p>
									Name: {renter?.first_name}{" "}
									{renter?.last_name}
								</p>
								<p>
									Shipping Address:{" "}
									{renter?.address.residence_info},{" "}
									{renter?.address.sub_district},{" "}
									{renter?.address.district},{" "}
									{renter?.address.province},{" "}
									{renter?.address.postal_code}
								</p>
							</div>
						</div>
						<div className="bg-white p-4 shadow rounded-lg space-y-2">
							<h3 className="text-xl font-semibold">Renting</h3>
							<p>Rental Period: 1 month</p>
							<p>From: {formatDate(rental?.start_date ?? "")}</p>
							<p>To: {formatDate(rental?.end_date ?? "")}</p>
						</div>
					</div>
				</div>
				<div className="flex justify-end mt-6">
					{rental?.status === "approved" ? (
						<a
							href={`/rental/payment/${rentalId}`}
							className="bg-gray-700 text-white px-6 py-2 rounded-lg"
						>
							Proceed to Payment
						</a>
					) : (
						<button
							onClick={cancel}
							className="bg-gray-700 text-white px-6 py-2 rounded-lg"
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
