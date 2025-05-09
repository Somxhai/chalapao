"use client";

import { useState, useEffect } from "react";
import { useParams, notFound, useRouter } from "next/navigation";

import { RentalType } from "@/types/rental";
import { PaymentType } from "@/types/payment";
import { ItemType } from "@/types/item";
import { UserType } from "@/types/user";
import { AddressType } from "@/types/address";

type Action = { label: string; action: () => void };

const mapStatus = (rentalStatus: string): string => {
	switch (rentalStatus) {
		case "pending":
			return "Request Pending";
		case "approved":
			return "Request Approved";
		case "paid":
			return "Renting";
		case "completed":
			return "Completed";
		case "cancelled":
			return "Cancelled";
		default:
			return "Unknown Status";
	}
};

const calcDuration = (start?: string, end?: string): string => {
	if (!start || !end) return "-";
	const d1 = new Date(start);
	const d2 = new Date(end);
	const diffDays = Math.ceil((d2.getTime() - d1.getTime()) / 86400000);
	return `${diffDays} day(s)`;
};

const Page = () => {
	const { rentalId } = useParams<{ rentalId: string }>();
	const router = useRouter();

	const [rental, setRental] = useState<RentalType>();
	const [payment, setPayment] = useState<PaymentType>();
	const [item, setItem] = useState<ItemType>();
	const [lessor, setLessor] = useState<UserType>();
	const [renter, setRenter] = useState<UserType>();
	const [deliveryAddress, setDeliveryAddress] = useState<AddressType>();
	const [returnAddress, setReturnAddress] = useState<AddressType>();

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchRental = async () => {
			try {
				const res = await fetch(`/api/rental/${rentalId}`);
				if (!res.ok) throw new Error("Failed to fetch rental data");
				const data = await res.json();

				setRental(data.rental);
				setPayment(data.payment);
				setItem(data.item);
				setLessor(data.lessor_info);
				setRenter(data.renter_info);
				setDeliveryAddress(data.delivery_address);
				setReturnAddress(data.return_address);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchRental();
	}, [rentalId]);

	const updateRentalStatus = async (
		status: "approved" | "cancelled" | "completed"
	) => {
		if (!rentalId) return;
		try {
			const res = await fetch(`/api/rental/${rentalId}/status`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status }),
			});
			if (!res.ok) throw new Error("Failed to update rental status");
			router.push("/lender/rentals");
		} catch (error) {
			console.error("Error updating status:", error);
		}
	};

	if (loading) return <div className="text-center py-20">Loading...</div>;
	if (!rental || !item || !renter || !lessor) return notFound();

	const status = mapStatus(rental.status);
	const duration = calcDuration(rental.start_date, rental.end_date);
	const totalPrice = payment?.total_price;

	const formatAddress = (addr?: AddressType) =>
		addr
			? `${addr.residence_info}, ${addr.sub_district}, ${addr.district}, ${addr.province}, ${addr.postal_code}`
			: "-";

	const imageUrl = item.images?.[0]
		? `http://localhost:8787/${item.images[0]}`
		: "";

	const actions: Action[] =
		rental.status === "pending"
			? [
					{
						label: "Approve Request",
						action: () => updateRentalStatus("approved"),
					},
					{
						label: "Reject Request",
						action: () => updateRentalStatus("cancelled"),
					},
			  ]
			: rental.status === "paid"
			? [
					{
						label: "Confirm Return",
						action: () => updateRentalStatus("completed"),
					},
			  ]
			: [];

	return (
		<div className="max-w-6xl mx-auto bg-white rounded-lg p-6 shadow">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<h2 className="text-3xl font-semibold mb-1">
						{item.item_name}
					</h2>
					<p className="text-gray-600 mb-6">
						{renter.first_name} {renter.last_name}
					</p>

					<div className="grid grid-cols-2 gap-4 mb-6 border-b pb-4">
						<div>
							<h3 className="font-bold mb-2">Lessor</h3>
							<p>
								Name: {lessor.first_name} {lessor.last_name}
							</p>
							<p>
								Phone: <b>{lessor.phone_number}</b>
							</p>
							<p>
								Return Address:
								<br />
								{formatAddress(returnAddress)}
							</p>
						</div>
						<div>
							<h3 className="font-bold mb-2">Renter</h3>
							<p>
								Name:{" "}
								<b>
									{renter.first_name} {renter.last_name}
								</b>
							</p>
							<p>
								Phone: <b>{renter.phone_number}</b>
							</p>
							<p>
								Delivery Address:
								<br />
								{formatAddress(deliveryAddress)}
							</p>
						</div>
					</div>

					<div className="mb-6">
						<h3 className="font-bold text-lg mb-2">Rental Info</h3>
						<p>Duration: {duration}</p>
						<p>
							From: {new Date(rental.start_date).toLocaleString()}
						</p>
						<p>To: {new Date(rental.end_date).toLocaleString()}</p>
					</div>
				</div>

				<div className="space-y-4">
					<p className="text-lg font-semibold text-right">{status}</p>
					<div className="w-full flex justify-center">
						{imageUrl ? (
							<img
								src={imageUrl}
								alt={item.item_name}
								className="rounded-lg object-contain w-[200px] h-[200px]"
							/>
						) : (
							<div className="w-[200px] h-[200px] bg-gray-200 rounded-lg"></div>
						)}
					</div>

					<div className="border p-6 rounded-lg shadow mb-2">
						<div className="flex gap-4 mb-2">
							{imageUrl && (
								<img
									src={imageUrl}
									alt={item.item_name}
									className="w-16 h-16 object-cover rounded-lg"
								/>
							)}
							<div className="flex-1 text-sm">
								<p className="font-semibold">
									{item.item_name}
								</p>
								<p>
									Lessor: {lessor.first_name}{" "}
									{lessor.last_name}
								</p>
								<p>
									Renter: {renter.first_name}{" "}
									{renter.last_name}
								</p>
							</div>
						</div>
						<div className="text-sm text-gray-600">
							<div className="flex justify-between font-bold">
								<span>Total</span>
								<span>{totalPrice} THB</span>
							</div>
						</div>
					</div>

					{actions.length > 0 && (
						<div className="flex flex-col gap-3">
							{actions.map((a, i) => (
								<button
									key={i}
									onClick={a.action}
									className="bg-gray-700 text-white px-6 py-2 rounded-lg"
								>
									{a.label}
								</button>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Page;
