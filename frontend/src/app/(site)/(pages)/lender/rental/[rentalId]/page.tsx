"use client";

import { useState, useEffect } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { Checkbox, Textarea, TextInput } from "flowbite-react";

type RentalDetail = {
	id: string;
	item: {
		id: string;
		item_name: string;
		description: string;
		price_per_day: number;
		images: string[];
	};
	renter_info: {
		first_name: string;
		last_name: string;
		phone_number: string;
	};
	lessor_info: {
		first_name: string;
		last_name: string;
		phone_number: string;
	};
	start_date: string;
	end_date: string;
	status: string;
	payment: {
		status: string;
		total_price: number;
	};
	delivery_address_info: {
		residence_info: string;
		sub_district: string;
		district: string;
		province: string;
		postal_code: string;
	};
	return_address_info?: {
		residence_info: string;
		sub_district: string;
		district: string;
		province: string;
		postal_code: string;
	};
};

type Action = { label: string; action: () => void };

const mapStatus = (rentalStatus: string, paymentStatus?: string): string => {
	switch (rentalStatus) {
		case "pending":
			return "Request Pending";
		case "accepted":
			if (paymentStatus === "Pending") return "Request Approved";
			if (paymentStatus === "Paid") return "Paid";
			return "Currently Rented";
		case "returned":
			return "Being Returned";
		case "cancel":
			return "Cancelled";
		default:
			return "Completed";
	}
};

const calcDuration = (start?: string, end?: string): string => {
	if (!start || !end) return "-";
	const d1 = new Date(start);
	const d2 = new Date(end);
	const diffDays = Math.ceil((d2.getTime() - d1.getTime()) / 86_400_000);
	return `${diffDays} day(s)`;
};

const Page = () => {
	const { rentalId } = useParams<{ rentalId: string }>();
	const router = useRouter();
	const [rental, setRental] = useState<RentalDetail | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchRental = async () => {
			try {
				const res = await fetch(`/api/rental/${rentalId}`);
				if (!res.ok) throw new Error("Failed to fetch rental data");
				const data = await res.json();
				setRental(data);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchRental();
	}, [rentalId]);

	const updateRentalStatus = async (status: "accepted" | "cancel") => {
		if (!rentalId) return;

		try {
			const res = await fetch(`/api/rental/${rentalId}/status`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status }),
			});
			if (!res.ok) throw new Error("Failed to update rental status");
			const data = await res.json();

			router.push("/lender/rentals");
		} catch (error) {
			console.error("Error updating status:", error);
		}
	};

	if (loading) return <div className="text-center py-20">Loading...</div>;
	if (!rental) return notFound();

	const status = mapStatus(rental.status, rental.payment?.status);
	const isReturning = status === "Being Returned";

	const rentPrice = rental.payment?.total_price ?? rental.item.price_per_day;
	const totalPrice = rentPrice;
	const duration = calcDuration(rental.start_date, rental.end_date);

	const fullAddress = rental.delivery_address_info
		? `${rental.delivery_address_info.residence_info}, ${rental.delivery_address_info.sub_district}, ${rental.delivery_address_info.district}, ${rental.delivery_address_info.province}, ${rental.delivery_address_info.postal_code}`
		: "-";
	const fullReturnAddress = rental.return_address_info
		? `${rental.return_address_info.residence_info}, ${rental.return_address_info.sub_district}, ${rental.return_address_info.district}, ${rental.return_address_info.province}, ${rental.return_address_info.postal_code}`
		: "-";

	const imageUrl = rental.item.images?.[0]
		? `http://localhost:8787/${rental.item.images[0]}`
		: "";

	const actions: Action[] =
		rental.status === "pending"
			? [
					{
						label: "Approve Request",
						action: () => updateRentalStatus("accepted"),
					},
					{
						label: "Reject Request",
						action: () => updateRentalStatus("cancel"),
					},
			  ]
			: [];

	return (
		<div className="max-w-6xl mx-auto bg-white rounded-lg p-6 shadow">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left */}
				<div className="lg:col-span-2">
					<h2 className="text-3xl font-semibold mb-1">
						{rental.item.item_name}
					</h2>
					<p className="text-gray-600 mb-6">
						{rental.renter_info.first_name}{" "}
						{rental.renter_info.last_name}
					</p>

					<div className="grid grid-cols-2 gap-4 mb-6 border-b pb-4">
						<div>
							<h3 className="font-bold mb-2">Lessor</h3>
							<p>
								Name: {rental.lessor_info.first_name}{" "}
								{rental.lessor_info.last_name}
							</p>
							<p>
								Phone: <b>{rental.lessor_info.phone_number}</b>
							</p>
							<p>
								Return Address: <br />
								{fullReturnAddress}
							</p>
						</div>
						<div>
							<h3 className="font-bold mb-2">Renter</h3>
							<p>
								Name:{" "}
								<b>
									{rental.renter_info.first_name}{" "}
									{rental.renter_info.last_name}
								</b>
							</p>
							<p>
								Phone: <b>{rental.renter_info.phone_number}</b>
							</p>
							<p>
								Delivery Address: <br />
								{fullAddress}
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

					{isReturning && (
						<div className="mb-6 border-t pt-4">
							<p className="text-red-600 font-semibold mb-2">
								Please inspect the item carefully before
								confirming return.
							</p>
							<div className="space-y-3">
								<label className="flex items-center gap-2 text-sm">
									<Checkbox /> Missing item
								</label>
								<label className="flex items-center gap-2 text-sm">
									<Checkbox /> Damaged item
								</label>
								<div className="flex items-center gap-2">
									<label className="text-sm">
										Damage compensation
									</label>
									<TextInput type="number" className="w-28" />
									<span>THB</span>
								</div>
								<label className="text-sm block">
									Description
								</label>
								<Textarea rows={3} />
							</div>
						</div>
					)}
				</div>

				{/* Right */}
				<div className="space-y-4">
					<p className="text-lg font-semibold text-right">{status}</p>
					<div className="w-full flex justify-center">
						{imageUrl ? (
							<img
								src={imageUrl}
								alt={rental.item.item_name}
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
									alt={rental.item.item_name}
									className="w-16 h-16 object-cover rounded-lg"
								/>
							)}
							<div className="flex-1 text-sm">
								<p className="font-semibold">
									{rental.item.item_name}
								</p>
								<p>
									Lessor: {rental.lessor_info.first_name}{" "}
									{rental.lessor_info.last_name}
								</p>
								<p>
									Renter: {rental.renter_info.first_name}{" "}
									{rental.renter_info.last_name}
								</p>
							</div>
						</div>

						<div className="text-sm text-gray-600">
							<div className="flex justify-between">
								<span>Rental fee ({duration})</span>
								<span>{rentPrice.toLocaleString()} THB</span>
							</div>
							<div className="flex justify-between font-bold">
								<span>Total</span>
								<span>{totalPrice.toLocaleString()} THB</span>
							</div>
						</div>
					</div>

					{/* Actions */}
					{actions.length > 0 && (
						<div className="flex flex-col gap-3">
							{actions.map((action, i) => (
								<button
									key={i}
									onClick={action.action}
									className="w-full bg-gray-700 text-white rounded-lg py-2"
								>
									{action.label}
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
