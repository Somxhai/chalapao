"use client";

import React from "react";
import Image from "next/image";
import { data as users } from "@/data/user";
import { data as addresses } from "@/data/address";

const userId = "1111111111"; // mock logged-in user

const AccountPage = () => {
	const user = users.find((u) => u.id === userId);
	const userAddresses = addresses.filter((a) => a.user_id === userId);

	if (!user) return <p className="text-center py-10">User not found.</p>;

	const isExternalImage = user.image_url?.startsWith("http");

	return (
		<div className="max-w-7xl mx-auto px-4 py-10 min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
			<div className="grid md:grid-cols-3 gap-6">
				{/* Left Column */}
				<div className="flex flex-col items-center">
					<h1 className="text-2xl font-semibold mb-4">My Account</h1>
					{isExternalImage ? (
						<img
							src={user.image_url}
							alt="Profile"
							className="w-32 h-32 rounded-md object-cover"
						/>
					) : (
						<Image
							src={user.image_url || "/default-profile.png"}
							alt="Profile"
							width={128}
							height={128}
							className="w-32 h-32 rounded-md object-cover"
						/>
					)}
					<button className="text-sm bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-1 mt-2 rounded">
						Choose Image
					</button>
				</div>

				{/* Right Column */}
				<div className="md:col-span-2 flex flex-col gap-6">
					{/* Profile */}
					<div className="flex justify-between items-center px-1 max-w-xl w-full">
						<h2 className="text-lg font-semibold">Profile</h2>
						<button className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600">
							Edit Profile
						</button>
					</div>
					<section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow max-w-xl w-full">
						<div className="space-y-1 text-sm">
							<p>ชื่อผู้ใช้: <b>{user.user_name}</b></p>
							<p>ชื่อ: <b>{user.first_name}</b></p>
							<p>นามสกุล: <b>{user.last_name}</b></p>
							<p>เบอร์โทรศัพท์: {user.phone}</p>
							<p>อีเมล: {user.email}</p>
							<p>เพศ: {user.gender}</p>
							<p>วัน/เดือน/ปี เกิด: {user.birth}</p>
						</div>
					</section>

					{/* Account */}
					<div className="flex justify-between items-center px-1 max-w-xl w-full">
						<h2 className="text-lg font-semibold">Account</h2>
						<button className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600">
							Change Password
						</button>
					</div>
					<section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow max-w-xl w-full">
						<p className="text-sm mb-1">บัญชีผู้ใช้: {user.user_name}</p>
						<p className="text-sm">วิธีการเข้าสู่ระบบ: <b>Email</b></p>
					</section>

					{/* Shipping Address */}
					<div className="flex justify-between items-center px-1 max-w-xl w-full">
						<h2 className="text-lg font-semibold">Shipping Address</h2>
						<button className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600">
							Add New
						</button>
					</div>
					<section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow max-w-xl w-full">
						<div className="space-y-4 text-sm">
							{userAddresses.map((address, i) => (
								<div key={address.id}>
									<div className="flex justify-between">
										<span>
											Shipping Address - {i + 1}{" "}
											{address.is_primary && (
												<span className="text-xs text-gray-500">หลัก</span>
											)}
										</span>
										<button className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600">
											Edit
										</button>
									</div>
									<p className="text-gray-500 mt-1">
										{address.district || address.subdistrict}
									</p>
								</div>
							))}
						</div>
					</section>

					{/* Payment Methods */}
					<div className="flex justify-between items-center px-1 max-w-xl w-full">
						<h2 className="text-lg font-semibold">Payment Methods</h2>
						<button className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600">
							Add New
						</button>
					</div>
					<section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow max-w-xl w-full">
						<div className="text-sm space-y-3">
							<p className="font-medium text-blue-600 underline">
								บัตรเครดิต / เดบิต (MasterCard)
							</p>
							<div className="flex justify-between items-start gap-4">
								<div className="space-y-1">
									<p>ชื่อบนบัตร: Thanawat Rattanachai</p>
									<p>หมายเลขบัตร: 5522 7512 3412 7890</p>
									<p>วันหมดอายุ: 08/27</p>
									<p>รหัส CVV: ***</p>
									<p className="text-green-500">สถานะ: เปิดใช้งาน</p>
								</div>
								<Image
									src="/icons/mastercard-logo.png"
									alt="MasterCard"
									width={48}
									height={32}
									className="object-contain mt-1"
								/>
							</div>
							<div className="flex justify-end">
								<button className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600">
									Edit
								</button>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};

export default AccountPage;
