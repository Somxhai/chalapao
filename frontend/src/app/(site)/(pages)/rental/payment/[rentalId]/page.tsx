"use client";

import { useState, useEffect, Fragment } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

import Step from "@/components/Rental/step";

import Header from "@/components/Header";

import { PaymentType } from "@/types/payment";
import { ItemType } from "@/types/item";
import { UserType } from "@/types/user";

const Page = () => {
	const { rentalId } = useParams();

	const [payment, setPayment] = useState<PaymentType>();
	const [item, setItem] = useState<ItemType>();
	const [lessor, setLessor] = useState<UserType>();
	const [renter, setRenter] = useState<UserType>();
	const [loading, setLoading] = useState(true);
	const [selectedMethod, setSelectedMethod] = useState<string>("ThaiQR");
	const [phoneNumber, setPhoneNumber] = useState<string>("");

	useEffect(() => {
		const fetchRental = async () => {
			try {
				const res = await fetch(`/api/rental/${rentalId}`);
				if (!res.ok) throw new Error("Failed to fetch rental data");
				const data = await res.json();

				setPayment(data.payment);
				setItem(data.item);
				setLessor(data.lessor_info);
				setRenter(data.renter_info);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		if (rentalId) {
			fetchRental();
		}
	}, [rentalId]);

	if (loading) return <div>Loading...</div>;

	const paymentMethods = [
		{
			name: "TrueMoney",
			icon: "/icons/truemoneywallet.svg",
		},
		{ name: "ThaiQR", icon: "/icons/ThaiQR.svg" },
		{ name: "VISA", icon: "/icons/Visa.svg" },
		{ name: "PayPal", icon: "/icons/paypal.svg" },
	];

	const proceed = async () => {
		try {
			await fetch(`/api/rental/${rentalId}/status`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ status: "paid" }),
			}).then((res) => res.json());
			window.location.href = `/rental/success/${rentalId}`;
		} catch (error) {
			console.error("Error cancelling rental:", error);
			alert("Failed to cancel the rental request. Please try again.");
		}
	};

	return (
		<>
			<Header>{Step(3)}</Header>
			<main className="container mx-auto px-16 py-8">
				<div className="max-w-xs mx-auto bg-white shadow-md rounded-lg p-4 text-sm mb-10">
					<h1 className="text-2xl font-semibold mb-6">Rental Fee</h1>
					<div className="flex gap-2 items-start">
						<Image
							src={`/api/${item?.images[0]}`}
							width={100}
							height={100}
							alt={item?.item_name || ""}
							className="w-14 h-14 rounded-lg object-cover"
						/>
						<div>
							<p className="font-semibold">{item?.item_name}</p>
							<p className="text-xs text-gray-500">
								ผู้เช่า : {renter?.first_name}{" "}
								{renter?.last_name}
							</p>
							<p className="text-xs text-gray-500">
								ผู้ให้เช่า : {lessor?.first_name}{" "}
								{lessor?.last_name}
							</p>
						</div>
					</div>
					<div className="mt-4 space-y-1">
						<div className="flex justify-between border-t pt-2 font-bold">
							<span>รวม</span>
							<span>{payment?.total_price} บาท</span>
						</div>
					</div>
				</div>
				<div className="text-center mb-6">
					<h2 className="text-base font-semibold mb-4">
						Payment Methods
					</h2>
					<div className="flex justify-center gap-6 flex-wrap">
						{paymentMethods.map((method) => {
							const isSelected = selectedMethod === method.name;
							return (
								<Fragment key={method.name}>
									<input
										id={method.name}
										type="radio"
										name="paymentMethod"
										checked={isSelected}
										onChange={() =>
											setSelectedMethod(method.name)
										}
										className="hidden"
									/>
									<label
										htmlFor={method.name}
										className={`p-4 rounded-lg shadow border-2 ${
											isSelected
												? "border-gray-600"
												: "border-white"
										} bg-white w-[120px] h-[80px] flex flex-col justify-center items-center`}
									>
										<Image
											src={method.icon}
											width={40}
											height={40}
											alt={method.name}
											className="h-12 object-contain"
										/>
									</label>
								</Fragment>
							);
						})}
					</div>
				</div>
				<div className="text-center mb-10">
					<h2 className="text-base font-semibold mb-2">
						Billing details
					</h2>
					<div className="max-w-xs mx-auto space-y-4 text-left">
						{selectedMethod === "TrueMoney" && (
							<>
								<label
									htmlFor="phone"
									className="text-sm font-medium block"
								>
									หมายเลขโทรศัพท์ (TrueMoney Wallet)
								</label>
								<input
									type="text"
									id="phone"
									placeholder="0812345678"
									className="w-full border px-3 py-2 rounded-lg text-sm"
									value={phoneNumber}
									onChange={(e) =>
										setPhoneNumber(e.target.value)
									}
								/>
							</>
						)}
						{selectedMethod === "ThaiQR" && (
							<>
								<label
									htmlFor="ref"
									className="text-sm font-medium block mb-2"
								>
									Reference Code (Thai QR)
								</label>
								<div className="border rounded-lg p-3 bg-gray-50">
									<Image
										src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/QR_Code_Example.svg/1024px-QR_Code_Example.svg.png"
										width={200}
										height={200}
										alt="PromptPay QR"
										className="w-48 h-auto rounded-lg mx-auto"
									/>
								</div>
							</>
						)}
						{selectedMethod === "VISA" && (
							<>
								<label
									htmlFor="card"
									className="text-sm font-medium block"
								>
									Card Number (VISA)
								</label>
								<input
									type="text"
									id="card"
									placeholder="xxxx xxxx xxxx xxxx"
									className="w-full border px-3 py-2 rounded-lg text-sm"
								/>
								<div className="flex gap-2">
									<div className="w-1/2">
										<label className="text-sm font-medium block">
											Expiry Date
										</label>
										<input
											type="text"
											placeholder="MM/YY"
											className="w-full border px-3 py-2 rounded-lg text-sm"
										/>
									</div>
									<div className="w-1/2">
										<label className="text-sm font-medium block">
											CVV
										</label>
										<input
											type="text"
											placeholder="123"
											className="w-full border px-3 py-2 rounded-lg text-sm"
										/>
									</div>
								</div>
							</>
						)}
						{selectedMethod === "PayPal" && (
							<>
								<label
									htmlFor="paypal-email"
									className="text-sm font-medium block"
								>
									PayPal Email
								</label>
								<input
									type="email"
									id="paypal-email"
									placeholder="example@paypal.com"
									className="w-full border px-3 py-2 rounded-lg text-sm"
								/>
							</>
						)}
					</div>
				</div>
				<div className="text-center">
					<button
						onClick={proceed}
						className="bg-gray-700 text-white px-6 py-2 rounded-lg"
					>
						Proceed
					</button>
				</div>
			</main>
		</>
	);
};

export default Page;
