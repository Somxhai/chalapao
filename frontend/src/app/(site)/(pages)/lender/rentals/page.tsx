"use client";

import { useState, useEffect } from "react";
import { Tabs, TabItem, Card, Button } from "flowbite-react";
import Link from "next/link";

import { useSession } from "@/lib/auth-client";

type RentalItem = {
	description: string;
	id: string;
	name: string;
	store: string;
	price: number;
	status: string;
	image: string;
	actions?: { label: string; href?: string; onClick?: () => void }[];
};

const mapStatus = (rentalStatus: string, paymentStatus?: string): string => {
	switch (rentalStatus) {
		case "pending":
			return "Request Pending";
		case "accepted": {
			if (paymentStatus === "Pending") return "Request Approved";
			if (paymentStatus === "Paid") return "Paid";
			return "Currently Rented";
		}
		case "completed":
			return "Completed";
		case "cancel":
			return "Cancelled";
		default:
			return "Unknown Status";
	}
};

const mapActions = (status: string, id: string) => {
	switch (status) {
		case "Request Pending":
			return [{ label: "Accept/Reject", href: `/lender/rental/${id}` }];
		case "Request Approved":
			return [{ label: "Waiting for Payment" }];
		case "Paid":
			return [{ label: "View Details", href: `/lender/rental/${id}` }];
		case "Currently Rented":
			return [{ label: "View Details", href: `/lender/rental/${id}` }];
		case "Completed":
			return [{ label: "View Details", href: `/lender/rental/${id}` }];
		case "Cancelled":
			return [{ label: "View Details", href: `/lender/rental/${id}` }];
		default:
			return [];
	}
};

const statusGroups: Record<string, (s: string) => boolean> = {
	all: () => true,
	request: (s) => s === "Request Pending",
	current: (s) =>
		["Request Approved", "Paid", "Currently Rented"].includes(s),
	completed: (s) => s === "Completed",
	cancelled: (s) => s === "Cancelled",
};

const RentalCard = ({ rental }: { rental: RentalItem }) => (
	<Card className="mb-4">
		<div className="flex gap-4">
			<div className="w-24 h-24 bg-gray-100 flex items-center justify-center">
				{rental.image ? (
					<img
						src={rental.image}
						alt={rental.name}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="text-gray-400 text-3xl">No Image</div>
				)}
			</div>
			<div className="flex-1">
				<h5 className="text-lg font-semibold">{rental.name}</h5>
				<p className="text-sm text-gray-600">{rental.description}</p>
			</div>
			<div className="flex flex-col justify-between text-right items-end gap-1">
				<span className="text-sm text-gray-600">{rental.status}</span>
				<span className="text-lg font-bold">
					{rental.price.toLocaleString()} THB
				</span>
				<div className="flex flex-wrap gap-1 justify-end">
					{rental.actions?.map((action, i) =>
						action.href ? (
							<Link key={i} href={action.href}>
								<Button size="xs" color="gray">
									{action.label}
								</Button>
							</Link>
						) : (
							<Button key={i} size="xs" color="gray" disabled>
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
	<div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow">
		<div className="mb-4">
			<input
				type="text"
				placeholder="Search..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="border border-gray-300 rounded-lg p-2 w-[30%]"
			/>
		</div>
		<div className="bg-white rounded-lg max-h-[600px] overflow-y-auto space-y-4 h-[600px]">
			{rentals.length ? (
				rentals.map((r) => <RentalCard key={r.id} rental={r} />)
			) : (
				<div className="flex items-center justify-center h-full">
					<p className="text-gray-500 text-lg">No records found</p>
				</div>
			)}
		</div>
	</div>
);

const Page = () => {
	const [rentalsData, setRentalsData] = useState<RentalItem[]>([]);
	const [search, setSearch] = useState("");

	const session = useSession();

	useEffect(() => {
		const fetchRentals = async () => {
			if (!session?.data?.user.id) return;
			try {
				const res = await fetch(
					`/api/rental/user/lessor/${session.data.user.id}`
				);
				const data = await res.json();
				console.log("Fetched rentals:", data);

				const rentals = data.map((r: any) => {
					const status = mapStatus(r.status, r.payment?.status);
					return {
						id: r.id,
						name: r.item?.item_name || "Unnamed Product",
						description: r.item?.description || "No description",
						store: r.lessor_info?.first_name || "Unknown Store",
						price:
							r.payment?.total_price ??
							r.item?.price_per_day ??
							0,
						status,
						image: r.item?.images?.[0]
							? `http://localhost:8787/${r.item.images[0]}`
							: "",
						actions: mapActions(status, r.id),
					};
				});

				setRentalsData(rentals);
			} catch (error) {
				console.error("Failed to fetch rentals", error);
			}
		};

		fetchRentals();
	}, [session]);

	const filteredByTab = (predicate: (s: string) => boolean) =>
		rentalsData
			.filter((r) => predicate(r.status))
			.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

	return (
		<>
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
			</Tabs>
		</>
	);
};

export default Page;
