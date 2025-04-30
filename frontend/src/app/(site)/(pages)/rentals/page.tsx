"use client";

import {
	useState,
	useEffect,
	JSXElementConstructor,
	Key,
	MouseEventHandler,
	ReactElement,
	ReactNode,
	ReactPortal,
} from "react";
import { Tabs, TabItem, Card, Button } from "flowbite-react";
import Link from "next/link";

import { useSession } from "@/lib/auth-client";
import { UrlObject } from "url";

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
	if (rentalStatus === "pending") return "รอผู้ปล่อยเช่ายืนยัน";
	if (rentalStatus === "accepted" && paymentStatus === "pending")
		return "ผู้ปล่อยเช่ายืนยันแล้ว";
	if (rentalStatus === "accepted" && paymentStatus === "completed")
		return "เช่าอยู่";
	if (rentalStatus === "cancel") return "ยกเลิกแล้ว";
	if (rentalStatus === "completed") return "เช่าสำเร็จแล้ว";
	if (paymentStatus === "failed") return "มีค่าปรับที่ต้องชำระ";
	return "ไม่ทราบสถานะ";
};

const mapActions = (status: string, id: string, rating?: number) => {
	switch (status) {
		case "รอผู้ปล่อยเช่ายืนยัน":
			return [{ label: "ยกเลิก", href: `/rental/confirm/${id}` }];
		case "ผู้ปล่อยเช่ายืนยันแล้ว":
			return [{ label: "ชำระเงิน", href: `/rental/payment/${id}` }];
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

const RentalCard = ({ rental }: { rental: any }) => (
	<Card className="mb-4">
		<div className="flex gap-4">
			<div className="w-24 h-24 flex items-center justify-center">
				<img
					className="rounded-t-lg aspect-square w-full object-cover"
					src={`http://localhost:8787/${rental?.image}`}
					alt={rental?.sname}
				/>
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
			<div className="flex flex-col justify-between items-end gap-1">
				<span className="text-sm text-gray-600">{rental.status}</span>
				<span className="text-lg font-bold">
					{rental.price.toLocaleString()} บาท
				</span>
				<div className="flex flex-wrap gap-1 justify-end">
					{rental.actions.map(
						(
							action: {
								href: string | UrlObject;
								label:
									| string
									| number
									| bigint
									| boolean
									| ReactElement<
											unknown,
											string | JSXElementConstructor<any>
									  >
									| Iterable<ReactNode>
									| Promise<
											| string
											| number
											| bigint
											| boolean
											| ReactPortal
											| ReactElement<
													unknown,
													| string
													| JSXElementConstructor<any>
											  >
											| Iterable<ReactNode>
											| null
											| undefined
									  >
									| null
									| undefined;
								onClick:
									| MouseEventHandler<HTMLButtonElement>
									| undefined;
							},
							i: Key | null | undefined
						) =>
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
	rentals: any[];
	search: string;
	setSearch: (v: string) => void;
}) => (
	<div className="max-w-5xl mx-auto p-4 bg-white rounded-lg shadow">
		<div className="p-4">
			<input
				type="text"
				placeholder="ค้นหา..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="border border-gray-300 rounded-md p-2 w-[30%]"
			/>
		</div>
		<div className="bg-white rounded-lg p-4 max-h-[600px] overflow-y-auto space-y-4">
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
	const [rentalsData, setRentalsData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const session = useSession();

	useEffect(() => {
		const fetchRentals = async () => {
			try {
				const response = await fetch(
					`/api/rental/user/${session?.data?.user.id}`
				);
				const data = await response.json();
				console.log("Fetched rentals:", data);

				const mapped = data.map((r: any) => ({
					id: r.id,
					name: r.item?.item_name || "ชื่อสินค้า",
					store: r.lessor_info?.first_name || "ชื่อร้าน",
					startDate: formatThaiDate(r.start_date) ?? "-",
					endDate: formatThaiDate(r.end_date) ?? "-",
					duration: getDuration(r.start_date, r.end_date),
					price: r.payment?.total_price ?? 0,
					status: mapStatus(r.status, r.payment?.status),
					image: r.item?.images?.[0] || "",
					rating: 0,
					actions: mapActions(
						mapStatus(r.status, r.payment?.status),
						r.id,
						0
					),
				}));

				setRentalsData(mapped);
			} catch (error) {
				console.error("Error fetching rentals:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchRentals();
	}, [session]);

	const filteredByTab = (predicate: (s: string) => boolean) =>
		rentalsData
			.filter((r) => predicate(r.status))
			.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

	const formatThaiDate = (d: string) =>
		new Date(d).toLocaleString("th-TH", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});

	if (loading) return <div className="text-center p-10">Loading...</div>;

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
				{/* <TabItem title="Being Returned">
					<ScrollableRentalList
						rentals={filteredByTab(statusGroups.returning)}
						search={search}
						setSearch={setSearch}
					/>
				</TabItem> */}
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
				{/* <TabItem title="Penalty">
					<ScrollableRentalList
						rentals={filteredByTab(statusGroups.penalty)}
						search={search}
						setSearch={setSearch}
					/>
				</TabItem> */}
			</Tabs>
		</div>
	);
};

export default Page;
