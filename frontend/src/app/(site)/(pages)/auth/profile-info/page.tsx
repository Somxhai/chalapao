"use client";

import { useState, useEffect } from "react";

import { Button, Label, TextInput } from "flowbite-react";

const ProfileInfo = () => {
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
	const [file, setFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const selectedFile = event.target.files[0];
			setFile(selectedFile);
			setPreviewUrl(URL.createObjectURL(selectedFile));
		}
	};
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData();
		formData.append("firstName", firstName);
		formData.append("lastName", lastName);
		formData.append("phone", phone);
		formData.append("idCard", idCard);
		formData.append("dob", dob);
		formData.append("gender", gender);
		formData.append("address", address);
		formData.append("subdistrict", subdistrict);
		formData.append("district", district);
		formData.append("province", province);
		formData.append("postalCode", postalCode);
		if (file) {
			formData.append("file", file);
		}
	};

	return (
		<>
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
							<div className="flex flex-col flex-1 min-w-0 gap-4 pr-6">
								<Label htmlFor="first-name">First Name</Label>
								<TextInput
									id="first-name"
									type="text"
									required
									className=""
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
									className=""
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
								<div className="flex justify-between items-center mt-4 mb-4 mx-auto w-full">
									{previewUrl ? (
										<img
											src={previewUrl}
											alt="Preview"
											className="mx-auto w-20 h-20 rounded-full"
										/>
									) : (
										<img
											src="/icons/logo_black.svg"
											alt="Logo"
											className="mx-auto w-20 h-20"
										/>
									)}
									<label
										htmlFor="file-upload"
										className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white text-center text-sm py-2 px-4 rounded-lg h-fit"
									>
										Choose Image
									</label>
									<input
										type="file"
										id="file-upload"
										accept="image/*"
										onChange={handleFileChange}
										className="hidden"
									/>
								</div>
							</div>
							<div className="w-px bg-gray-300 self-stretch shrink-0"></div>
							<div className="flex flex-col flex-1 min-w-0 gap-4 pl-6">
								<Label htmlFor="dob">Date of Birth</Label>
								<TextInput
									id="dob"
									type="text"
									required
									value={dob}
									onChange={(e) => setDob(e.target.value)}
									placeholder="dd/mm/yy"
								/>
								<Label>Gender</Label>
								<div className="flex flex-wrap">
									{[
										"Male",
										"Female",
										"Non-binary",
										"Not Say",
									].map((g) => (
										<div key={g} className="w-1/2 mb-2">
											<label className="flex items-center gap-2">
												<input
													type="radio"
													name="gender"
													value={g}
													onChange={(e) =>
														setGender(
															e.target.value
														)
													}
													checked={gender === g}
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
		</>
	);
};

export default ProfileInfo;
