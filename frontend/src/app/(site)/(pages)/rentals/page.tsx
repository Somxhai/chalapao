"use client";

import { useEffect, useState } from "react";
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
    return `${diff} days`;
};

const mapStatus = (rentalStatus: string): string => {
    switch (rentalStatus) {
        case "pending":
            return "Request Pending";
        case "approved":
            return "Request Approved";
        case "paid":
            return "Renting";
        case "completed":
            return "Completed";
        case "cancelled":
            return "Cancelled";
        default:
            return "Unknown Status";
    }
};

const mapActions = (status: string, id: string) => {
    switch (status) {
        case "Request Pending":
            return [{ label: "Cancel", href: `/rental/pending/${id}` }];
        case "Request Approved":
            return [{ label: "Pay Now", href: `/rental/payment/${id}` }];
        case "Renting":
        case "Completed":
        case "Cancelled":
            return [{ label: "View Details", href: `/rental/${id}` }];
        default:
            return [];
    }
};

const statusGroups: Record<string, (s: string) => boolean> = {
    all: () => true,
    request: (s) => s === "Request Pending",
    current: (s) => ["Request Approved", "Paid"].includes(s),
    completed: (s) => s === "Completed",
    cancelled: (s) => s === "Cancelled",
};

const RentalCard = ({ rental }: { rental: any }) => (
    <Card className="mb-4">
        <div className="flex gap-4">
            <div className="w-24 h-24 flex items-center justify-center">
                <img
                    className="rounded-t-lg aspect-square w-full object-cover"
                    src={`http://localhost:8787/${rental?.image}`}
                    alt={rental?.name}
                />
            </div>
            <div className="flex-1">
                <h5 className="text-lg font-semibold">{rental.name}</h5>
                <p className="text-sm">From: {rental.startDate}</p>
                <p className="text-sm">To: {rental.endDate}</p>
                <p className="text-sm">Duration: {rental.duration}</p>
            </div>
            <div className="flex flex-col justify-between items-end gap-1">
                <span className="text-sm text-gray-600">{rental.status}</span>
                <span className="text-lg font-bold">
                    {rental.price.toLocaleString()} THB
                </span>
                <div className="flex flex-wrap gap-1 justify-end">
                    {rental.actions.map((action: any, i: number) =>
                        action.href ? (
                            <Link
                                key={i}
                                href={action.href as UrlObject | string}
                            >
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
    rentals: any[];
    search: string;
    setSearch: (v: string) => void;
}) => (
    <div className="max-w-5xl mx-auto p-4 bg-white rounded-lg shadow">
        <div className="p-4">
            <input
                type="text"
                placeholder="Search..."
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
                    <p className="text-gray-500 text-lg">No rentals found</p>
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
        if (!session?.data?.user.id) return;
        const fetchRentals = async () => {
            try {
                const response = await fetch(
                    `/api/rental/user/${session?.data?.user.id}`
                );
                const data = await response.json();

                const mapped = data.map((r: any) => {
                    const status = mapStatus(r.rental?.status);
                    return {
                        id: r.rental?.id,
                        name: r.item?.item_name || "Unnamed Product",
                        description: r.item?.description || "No description",
                        store: `${r.lessor_info?.first_name || "Unknown"} ${r.lessor_info?.last_name || ""
                            }`.trim(),
                        price:
                            r.payment?.total_price ??
                            r.item?.price_per_day ??
                            0,
                        status,
                        image: r.item.images[0],
                        duration: getDuration(
                            r.rental?.start_date,
                            r.rental?.end_date
                        ),
                        startDate: new Date(
                            r.rental?.start_date
                        ).toLocaleDateString(),
                        endDate: new Date(
                            r.rental?.end_date
                        ).toLocaleDateString(),
                        actions: mapActions(status, r.rental?.id),
                    };
                });

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
        </div>
    );
};

export default Page;
