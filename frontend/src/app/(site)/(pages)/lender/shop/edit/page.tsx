"use client";

import React, { useState, useEffect } from "react";
import { data as users } from "@/data/user";
import { UserType } from "@/types/user";

const Page = () => {
	const userId = "2222222222";
	const [shop, setShop] = useState<UserType | null>(null);
	const [loading, setLoading] = useState(true);
	const [storeName, setStoreName] = useState("");
	const [storeDescription, setStoreDescription] = useState(
		"ให้บริการเช่าอุปกรณ์ครบวงจร พร้อมคำแนะนำจากมืออาชีพ"
	);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [phone, setPhone] = useState("");
	const [residenceInfo, setResidenceInfo] = useState("");
	const [subdistrict, setSubdistrict] = useState("");
	const [district, setDistrict] = useState("");
	const [province, setProvince] = useState("");
	const [postalCode, setPostalCode] = useState("");
	useEffect(() => {
		const foundShop = users.find((u) => u.id === userId);
		if (foundShop) {
			setShop(foundShop);
			setStoreName(foundShop.user_name || "");
			setFirstName(foundShop.first_name || "");
			setLastName(foundShop.last_name || "");
			setPhone(foundShop.phone || "");
			const address = foundShop.address.find((a) => a.is_primary);
			if (address) {
				setResidenceInfo(address.residence_info || "");
				setSubdistrict(address.subdistrict || "");
				setDistrict(address.district || "");
				setProvince(address.province || "");
				setPostalCode(address.postal_code || "");
			}
		}
		setLoading(false);
	}, []);
	if (loading) {
		return (
			<p className="text-center text-gray-500 mt-10">
				Loading store info...
			</p>
		);
	}
	if (!shop) {
		return (
			<p className="text-center text-red-500 mt-10">ไม่พบข้อมูลร้าน</p>
		);
	}
	return (
		<>
			<div className="max-w-3xl mx-auto">
				<h1 className="text-2xl font-semibold mb-4">Edit My Store</h1>
				<div className="bg-white rounded-lg shadow p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
					<div className="flex flex-col items-center">
						<img
							src={shop.image_url || "/default-logo.png"}
							alt="Store Logo"
							className="w-64 h-64 object-cover border rounded-lg mb-3"
						/>
						<button className="text-xs px-3 py-1 bg-gray-200 rounded-lg">
							Choose Image
						</button>
					</div>
					<div className="space-y-6">
						<div>
							<h2 className="text-sm font-semibold mb-2">
								Store Details
							</h2>
							<input
								type="text"
								placeholder="Store Name"
								value={storeName}
								onChange={(e) => setStoreName(e.target.value)}
								className="w-full border rounded-lg px-3 py-2 text-sm mb-2"
							/>
							<textarea
								placeholder="Store Description"
								value={storeDescription}
								onChange={(e) =>
									setStoreDescription(e.target.value)
								}
								className="w-full border rounded-lg px-3 py-2 text-sm h-24"
							/>
						</div>
						<div>
							<h2 className="text-sm font-semibold mb-2">
								Contact Information
							</h2>
							<input
								type="text"
								placeholder="Name"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								className="w-full border rounded-lg px-3 py-2 text-sm mb-2"
							/>
							<input
								type="text"
								placeholder="Surname"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								className="w-full border rounded-lg px-3 py-2 text-sm mb-2"
							/>
							<input
								type="text"
								placeholder="Phone Number"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								className="w-full border rounded-lg px-3 py-2 text-sm mb-2"
							/>
							<input
								type="text"
								placeholder="residence info"
								value={residenceInfo}
								onChange={(e) =>
									setResidenceInfo(e.target.value)
								}
								className="w-full border rounded-lg px-3 py-2 text-sm mb-2"
							/>
							<div className="grid grid-cols-2 gap-4 mb-2">
								<input
									type="text"
									placeholder="subdistrict"
									value={subdistrict}
									onChange={(e) =>
										setSubdistrict(e.target.value)
									}
									className="border rounded-lg px-3 py-2 text-sm"
								/>
								<input
									type="text"
									placeholder="district"
									value={district}
									onChange={(e) =>
										setDistrict(e.target.value)
									}
									className="border rounded-lg px-3 py-2 text-sm"
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<input
									type="text"
									placeholder="province"
									value={province}
									onChange={(e) =>
										setProvince(e.target.value)
									}
									className="border rounded-lg px-3 py-2 text-sm"
								/>
								<input
									type="text"
									placeholder="postal code"
									value={postalCode}
									onChange={(e) =>
										setPostalCode(e.target.value)
									}
									className="border rounded-lg px-3 py-2 text-sm"
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-6 flex justify-end gap-4">
					<button className="px-4 py-2 rounded-lg bg-gray-200 text-sm">
						Cancel
					</button>
					<button className="px-4 py-2 rounded-lg bg-gray-700 text-white text-sm">
						Save
					</button>
				</div>
			</div>
		</>
	);
};

export default Page;
