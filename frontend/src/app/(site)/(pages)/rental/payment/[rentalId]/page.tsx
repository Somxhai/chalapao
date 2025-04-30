"use client";

import { useState, useEffect, Fragment } from "react";
import { useParams, notFound } from "next/navigation";

import Step from "@/components/Rental/step";

import Header from "@/components/Header";

import { useSession } from "@/lib/auth-client";

const Page = () => {
	const { rentalId } = useParams();
	const session = useSession();

	const [item, setItem] = useState<any>(null);
	const [lender, setLender] = useState<any>(null);
	const [renter, setRenter] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [payment, setPayment] = useState<any>(null);
	const [selectedMethod, setSelectedMethod] = useState<string>("ThaiQR");
	const [phoneNumber, setPhoneNumber] = useState<string>("");

	useEffect(() => {
		const fetchRental = async () => {
			try {
				const rentalResponse = await fetch(`/api/rental/${rentalId}`);
				const rentalData = await rentalResponse.json();
				console.log("Fetched item:", rentalData);
				setPayment(rentalData.payment);
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
		console.log(
			"Selected method:",
			selectedMethod,
			"Phone number:",
			phoneNumber
		);

		try {
			const updatedRental = await fetch(
				`/api/rental/${rentalId}/status`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ status: "completed" }),
				}
			).then((res) => res.json());
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
						<img
							src={`http://localhost:8787/${item.images[0]}`}
							alt={item?.name}
							className="w-14 h-14 rounded-lg object-cover"
						/>
						<div>
							<p className="font-semibold">{item?.item_name}</p>
							<p className="text-xs text-gray-500">
								ผู้เช่า : {renter?.first_name}{" "}
								{renter?.last_name}
							</p>
							<p className="text-xs text-gray-500">
								ผู้ให้เช่า : {lender?.first_name}{" "}
								{lender?.last_name}
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
										<img
											src={method.icon}
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
									<img
										src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/QR_Code_Example.svg/1024px-QR_Code_Example.svg.png"
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
						className="bg-black text-white px-6 py-2 rounded-lg hover:opacity-90"
					>
						Proceed
					</button>
				</div>
			</main>
		</>
	);
};

export default Page;
