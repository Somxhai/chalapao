"use client";

import { useState, useEffect } from "react";

import { Button, Label, TextInput } from "flowbite-react";

import { useSession } from "@/lib/auth-client";

const Page = () => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [phone, setPhone] = useState("");
	const [idCard, setIdCard] = useState("");
	const [dob, setDob] = useState("");
	const [gender, setGender] = useState("");
	const [address, setAddress] = useState("");
	const [subdistrict, setSubdistrict] = useState("");
	const [district, setDistrict] = useState("");
	const [province, setProvince] = useState("");
	const [postalCode, setPostalCode] = useState("");

	const session = useSession();

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
					setFirstName(data.first_name || "");
					setLastName(data.last_name || "");
					setPhone(data.phone_number || "");
					setIdCard(data.citizen_id || "");
					setDob(
						data.birth_date
							? new Date(data.birth_date)
									.toISOString()
									.split("T")[0]
							: ""
					);
					setGender(data.gender || "");
					setAddress(data.residence_info || "");
					setSubdistrict(data.sub_district || "");
					setDistrict(data.district || "");
					setProvince(data.province || "");
					setPostalCode(data.postal_code || "");
					console.log("Fetched user:", data);
				} catch (error) {
					console.error("Error fetching user info:", error);
				}
			};

			fetchUser();
		}
	}, [session]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const userInfo = {
			first_name: firstName,
			last_name: lastName,
			phone_number: phone,
			citizen_id: idCard,
			birth_date: dob,
			gender,
			address,
			subdistrict,
			district,
			province,
			postal_code: postalCode,
			user_id: session?.data?.user.id,
		};

		try {
			const response = await fetch(
				`/api/user/info/${session?.data?.user.id}`
			);

			if (response.ok) {
				const updateResponse = await fetch(
					`/api/user/info/${session?.data?.user.id}`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(userInfo),
					}
				);

				if (!updateResponse.ok) {
					throw new Error("Failed to update user info");
				}

				const updateData = await updateResponse.json();
				console.log("User info updated successfully:", updateData);
				window.location.href = "/";
			} else {
				const createResponse = await fetch(
					`/api/user/info/${session?.data?.user.id}`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(userInfo),
					}
				);

				if (!createResponse.ok) {
					throw new Error("Failed to create user info");
				}

				const createData = await createResponse.json();
				console.log("User info created successfully:", createData);
				window.location.href = "/";
			}
		} catch (error) {
			console.error("Error processing user info:", error);
			alert("Failed to process user info. Please try again.");
		}
	};

	return (
		<main className="container mx-auto px-16 py-8">
			<div className="flex items-center justify-center min-h-screen">
				<div className="relative w-full max-w-2xl p-10 rounded-lg shadow bg-white">
					<div className="mb-8 text-center">
						<div className="mb-2 block">
							<img
								src="/icons/logo_black.svg"
								alt="Logo"
								className="mx-auto w-20 h-20"
							/>
						</div>
						<h1 className="text-3xl font-bold">Confirm</h1>
						<p className="text-sm text-gray-600">
							your personal information
						</p>
					</div>
					<form onSubmit={handleSubmit} className="w-full">
						<div className="flex items-start w-full">
							<div className="flex flex-col flex-1 min-w-0 gap-2 pr-6">
								<Label htmlFor="first-name">First Name</Label>
								<TextInput
									id="first-name"
									type="text"
									required
									value={firstName}
									onChange={(e) =>
										setFirstName(e.target.value)
									}
								/>
								<Label htmlFor="last-name">Last Name</Label>
								<TextInput
									id="last-name"
									type="text"
									required
									value={lastName}
									onChange={(e) =>
										setLastName(e.target.value)
									}
								/>
								<Label htmlFor="phone">Phone Number</Label>
								<TextInput
									id="phone"
									type="tel"
									required
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
								/>
								<Label htmlFor="id-card">
									National ID Card
								</Label>
								<TextInput
									id="id-card"
									type="text"
									required
									value={idCard}
									onChange={(e) => setIdCard(e.target.value)}
								/>
								<Label htmlFor="dob">Date of Birth</Label>
								<TextInput
									id="dob"
									type="text"
									required
									value={dob}
									onChange={(e) => setDob(e.target.value)}
									placeholder="dd/mm/yy"
								/>
							</div>
							<div className="w-px bg-gray-300 self-stretch shrink-0"></div>
							<div className="flex flex-col flex-1 min-w-0 gap-2 pl-6">
								<Label>Gender</Label>
								<div className="flex flex-wrap">
									{["Male", "Female", "Other"].map((g) => (
										<div key={g} className="w-1/2 mb-2">
											<label className="flex items-center gap-2">
												<input
													type="radio"
													name="gender"
													value={g}
													onChange={(e) =>
														setGender(
															e.target.value ===
																"Male"
																? "M"
																: e.target
																		.value ===
																  "Female"
																? "F"
																: "O"
														)
													}
													checked={
														(gender === "M" &&
															g === "Male") ||
														(gender === "F" &&
															g === "Female") ||
														(gender === "O" &&
															g === "Other")
													}
												/>
												{g}
											</label>
										</div>
									))}
								</div>
								<div className="flex flex-col gap-1">
									<Label>Primary Address</Label>
									<p className="text-sm ">residence info</p>
									<TextInput
										id="address"
										value={address}
										onChange={(e) =>
											setAddress(e.target.value)
										}
										placeholder="residence info"
									/>
								</div>
								<div className="flex gap-2">
									<div className="flex flex-col flex-1">
										<Label htmlFor="subdistrict">
											Subdistrict
										</Label>
										<TextInput
											id="subdistrict"
											value={subdistrict}
											onChange={(e) =>
												setSubdistrict(e.target.value)
											}
											placeholder="subdistrict"
										/>
									</div>
									<div className="flex flex-col flex-1">
										<Label htmlFor="district">
											District
										</Label>
										<TextInput
											id="district"
											value={district}
											onChange={(e) =>
												setDistrict(e.target.value)
											}
											placeholder="district"
										/>
									</div>
								</div>
								<div className="flex gap-2">
									<div className="flex flex-col flex-1">
										<Label htmlFor="province">
											Province
										</Label>
										<TextInput
											id="province"
											value={province}
											onChange={(e) =>
												setProvince(e.target.value)
											}
											placeholder="province"
										/>
									</div>
									<div className="flex flex-col flex-1">
										<Label htmlFor="postalCode">
											Postal Code
										</Label>
										<TextInput
											id="postalCode"
											value={postalCode}
											onChange={(e) =>
												setPostalCode(e.target.value)
											}
											placeholder="postal_code"
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="flex justify-center mt-8 w-full">
							<Button
								type="submit"
								className="w-1/3 border bg-gray-700 text-lg py-4"
							>
								Confirm
							</Button>
						</div>
					</form>
				</div>
			</div>
		</main>
	);
};

export default Page;
