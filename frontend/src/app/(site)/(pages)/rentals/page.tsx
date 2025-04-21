"use client";
import { useState, useMemo } from "react";
import { Tabs, TabItem, Card, Button } from "flowbite-react";
import Link from "next/link";

import { data as addresses } from "@/data/address";
import { data as categories } from "@/data/category";
import { data as items } from "@/data/item";
import { data as rentals } from "@/data/rental";
import { data as payments } from "@/data/payment";
import { data as users } from "@/data/user";

type RentalItem = {
	id: string;
	name: string;
	store: string;
	startDate: string;
	endDate: string;
	duration: string;
	price: number;
	status: string;
	image: string;
	rating?: number;
	actions: { label: string; href?: string; onClick?: () => void }[];
};

const getDuration = (start: string, end: string): string => {
	if (!start || !end) return "-";
	const startDate = new Date(start);
	const endDate = new Date(end);
	const diff = Math.ceil(
		(endDate.getTime() - startDate.getTime()) / 86_400_000
	);
	return `${diff} วัน`;
};

const mapStatus = (rentalStatus: string, paymentStatus?: string): string => {
	if (rentalStatus === "Pending") return "รอผู้ปล่อยเช่ายืนยัน";
	if (rentalStatus === "Active") return "เช่าอยู่";
	if (paymentStatus === "Pending") return "ผู้ปล่อยเช่ายืนยันแล้ว";
	if (paymentStatus === "Failed") return "มีค่าปรับที่ต้องชำระ";
	if (rentalStatus === "Failed") return "ยกเลิกแล้ว";
	return "เช่าสำเร็จแล้ว";
};

const mapActions = (status: string, id: string, rating?: number) => {
	switch (status) {
		case "รอผู้ปล่อยเช่ายืนยัน":
			return [{ label: "ยกเลิก", href: `/cancel/${id}` }];
		case "ผู้ปล่อยเช่ายืนยันแล้ว":
			return [
				{ label: "ชำระเงิน", href: `/payment/${id}` },
				{ label: "ยกเลิก", href: `/cancel/${id}` },
			];
		case "เช่าอยู่":
			return [
				{ label: "ยืนยันการส่งคืน", href: `/return/${id}` },
				{ label: "ยกเลิก", href: `/cancel/${id}` },
			];
		case "จัดส่งคืนแล้ว":
			return [{ label: "รอผู้ให้เช่ายืนยัน" }];
		case "เช่าสำเร็จแล้ว":
			return rating && rating > 0
				? [{ label: "เช่าซ้ำ", href: `/rental/${id}` }]
				: [{ label: "ให้คะแนน", href: `/rate/${id}` }];
		case "มีค่าปรับที่ต้องชำระ":
			return [{ label: "ชำระค่าปรับ", href: `/penalty/${id}` }];
		default:
			return [];
	}
};

const statusGroups = {
	all: () => true,
	request: (s: string) => s === "รอผู้ปล่อยเช่ายืนยัน",
	current: (s: string) => ["ผู้ปล่อยเช่ายืนยันแล้ว", "เช่าอยู่"].includes(s),
	returning: (s: string) => s === "จัดส่งคืนแล้ว",
	completed: (s: string) => s === "เช่าสำเร็จแล้ว",
	cancelled: (s: string) => s === "ยกเลิกแล้ว",
	penalty: (s: string) => s === "มีค่าปรับที่ต้องชำระ",
};

const rentalsData: RentalItem[] = rentals.map((r) => {
	const item = items.find((i) => i.id === r.item_id);
	const payment = payments.find((p) => p.id === r.payment_id);
	const owner = users.find((u) => u.id === item?.owner_id);

	const status = mapStatus(r.status, payment?.status);
	const rating = 0;

	return {
		id: r.id,
		name: item?.name || "ชื่อสินค้า",
		store: owner?.user_name || "ชื่อร้าน",
		startDate: r.start_date ?? "-",
		endDate: r.end_date ?? "-",
		duration: getDuration(r.start_date, r.end_date),
		price: payment?.total_price ?? item?.price_per_day ?? 0,
		status,
		image: item?.item_images?.[0]?.image_url ?? "",
		rating,
		actions: mapActions(status, r.id, rating),
	};
});

const RentalCard = ({ rental }: { rental: RentalItem }) => (
	<Card className="mb-4">
		<div className="flex gap-4">
			<div className="w-24 h-24 flex items-center justify-center">
				{rental.image ? (
					<img
						src={rental.image}
						alt={rental.name}
						className="w-full h-full object-cover"
					/>
				) : (
					<svg
						className="text-gray-400 text-3xl"
						stroke="currentColor"
						fill="none"
						strokeWidth="2"
						viewBox="0 0 24 24"
						aria-hidden="true"
						height="200px"
						width="200px"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
						></path>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
						></path>
					</svg>
				)}
			</div>

			<div className="flex-1">
				<h5 className="text-lg font-semibold">{rental.name}</h5>
				<p className="text-sm">ตั้งแต่: {rental.startDate}</p>
				<p className="text-sm">ถึง: {rental.endDate}</p>
				<p className="text-sm">ระยะเวลา: {rental.duration}</p>

				<Link
					href={`/rental/${rental.id}`}
					className="text-sm underline text-gray-500 hover:text-black"
				>
					ดูรายละเอียด
				</Link>
			</div>

			<div className="flex flex-col justify-between text-right items-end gap-1">
				<span className="text-sm text-gray-600">{rental.status}</span>
				<span className="text-lg font-bold">
					{rental.price.toLocaleString()} บาท
				</span>
				<div className="flex flex-wrap gap-1 justify-end">
					{rental.actions.map((action, i) =>
						action.href ? (
							<Link key={i} href={action.href}>
								<Button size="xs" color="gray">
									{action.label}
								</Button>
							</Link>
						) : (
							<Button
								key={i}
								size="xs"
								color="gray"
								onClick={action.onClick}
							>
								{action.label}
							</Button>
						)
					)}
				</div>
			</div>
		</div>
	</Card>
);

const ScrollableRentalList = ({
	rentals,
	search,
	setSearch,
}: {
	rentals: RentalItem[];
	search: string;
	setSearch: (v: string) => void;
}) => (
	<div className="max-w-5xl mx-auto p-4 bg-white rounded-lg shadow">
		<div className="mb-4">
			<input
				type="text"
				placeholder="ค้นหา..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="border border-gray-300 rounded-md p-2 w-[30%]"
			/>
		</div>
		<div className="bg-white rounded-lg p-4 max-h-[600px] overflow-y-auto space-y-4 h-[600px]">
			{rentals.length > 0 ? (
				rentals.map((r) => <RentalCard key={r.id} rental={r} />)
			) : (
				<div className="flex items-center justify-center h-full">
					<p className="text-gray-500 text-lg">ไม่มีรายการ</p>
				</div>
			)}
		</div>
	</div>
);

const Page = () => {
	const [search, setSearch] = useState("");
	const filteredByTab = (predicate: (s: string) => boolean) =>
		rentalsData
			.filter((r) => predicate(r.status))
			.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

	return (
		<div className="p-4 max-w-5xl mx-auto">
			<h1 className="text-2xl font-bold mb-4">Rental Management</h1>
			<Tabs aria-label="Rental Management Tabs">
				<TabItem title="All">
					<ScrollableRentalList
						rentals={filteredByTab(statusGroups.all)}
						search={search}
						setSearch={setSearch}
					/>
				</TabItem>
				<TabItem title="Rental Requests">
					<ScrollableRentalList
						rentals={filteredByTab(statusGroups.request)}
						search={search}
						setSearch={setSearch}
					/>
				</TabItem>
				<TabItem title="Currently Rented">
					<ScrollableRentalList
						rentals={filteredByTab(statusGroups.current)}
						search={search}
						setSearch={setSearch}
					/>
				</TabItem>
				<TabItem title="Being Returned">
					<ScrollableRentalList
						rentals={filteredByTab(statusGroups.returning)}
						search={search}
						setSearch={setSearch}
					/>
				</TabItem>
				<TabItem title="Rental Completed">
					<ScrollableRentalList
						rentals={filteredByTab(statusGroups.completed)}
						search={search}
						setSearch={setSearch}
					/>
				</TabItem>
				<TabItem title="Cancelled">
					<ScrollableRentalList
						rentals={filteredByTab(statusGroups.cancelled)}
						search={search}
						setSearch={setSearch}
					/>
				</TabItem>
				<TabItem title="Penalty">
					<ScrollableRentalList
						rentals={filteredByTab(statusGroups.penalty)}
						search={search}
						setSearch={setSearch}
					/>
				</TabItem>
			</Tabs>
		</div>
	);
};

export default Page;
