"use client";

import { useState, useEffect } from "react";

import { useParams, notFound } from "next/navigation";
import Image from "next/image";

import { data as users } from "@/data/user";
import { data as addresses } from "@/data/address";

const userId = "1111111111";

const Page = () => {
	const user = users.find((u) => u.id === userId);
	const userAddresses = addresses.filter((a) => a.user_id === userId);
	if (!user) return <p className="text-center py-10">User not found.</p>;
	const isExternalImage = user.image_url?.startsWith("http");
	return (
		<>
			<div className="grid md:grid-cols-3 gap-6">
				<div className="flex flex-col items-center w-full">
					<h1 className="text-2xl font-semibold mb-4">My Account</h1>
					<img
						src={user.image_url}
						alt="Profile"
						className="w-1/2 aspect-square rounded-full object-cover"
					/>
					<button className="text-sm bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-1 mt-2 rounded-lg">
						Choose Image
					</button>
				</div>
				<div className="md:col-span-2 flex flex-col gap-6 w-full">
					<section className="flex flex-col gap-2">
						<div className="flex justify-between items-center px-1 w-full">
							<h2 className="text-lg font-semibold">Profile</h2>
							<button className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
								Edit Profile
							</button>
						</div>
						<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow w-full">
							<div className="space-y-1 text-sm">
								<p>
									ชื่อผู้ใช้: <b>{user.user_name}</b>
								</p>
								<p>
									ชื่อ: <b>{user.first_name}</b>
								</p>
								<p>
									นามสกุล: <b>{user.last_name}</b>
								</p>
								<p>เบอร์โทรศัพท์: {user.phone}</p>
								<p>อีเมล: {user.email}</p>
								<p>เพศ: {user.gender}</p>
								<p>วัน/เดือน/ปี เกิด: {user.birth}</p>
							</div>
						</div>
					</section>
					<section className="flex flex-col gap-2">
						<div className="flex justify-between items-center px-1 w-full">
							<h2 className="text-lg font-semibold">Account</h2>
							<button className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
								Change Password
							</button>
						</div>
						<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow w-full">
							<p className="text-sm mb-1">
								บัญชีผู้ใช้: {user.user_name}
							</p>
							<p className="text-sm">
								วิธีการเข้าสู่ระบบ: <b>Email</b>
							</p>
						</div>
					</section>
					<section className="flex flex-col gap-2">
						<div className="flex justify-between items-center px-1 w-full">
							<h2 className="text-lg font-semibold">
								Shipping Address
							</h2>
							<button className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
								Add New
							</button>
						</div>
						<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow w-full">
							<div className="space-y-4 text-sm">
								{userAddresses.map((address, i) => (
									<div key={address.id}>
										<div className="flex justify-between">
											<span>
												Shipping Address - {i + 1}{" "}
												{address.is_primary && (
													<span className="text-xs text-gray-500">
														หลัก
													</span>
												)}
											</span>
											<button className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
												Edit
											</button>
										</div>
										<p className="text-gray-500 mt-1">
											{address.residence_info ||
												address.subdistrict}
										</p>
									</div>
								))}
							</div>
						</div>
					</section>
				</div>
			</div>
		</>
	);
};

export default Page;
