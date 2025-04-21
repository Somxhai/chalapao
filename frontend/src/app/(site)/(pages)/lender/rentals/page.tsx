// File: app/(lender)/rental/page.tsx

"use client";
import { useState } from "react";
import { Tabs, TabItem, Card, Button } from "flowbite-react";
import { HiOutlineCamera } from "react-icons/hi";
import Link from "next/link";

import { data as rentals } from "@/data/rental";
import { data as items } from "@/data/item";
import { data as payments } from "@/data/payment";
import { data as users } from "@/data/user";
import { data as itemImages } from "@/data/item_image";

/* ------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------*/

type RentalItem = {
  id: string;
  name: string;
  store: string;
  price: number;
  status: string;
  image: string;
  actions?: { label: string; href?: string; onClick?: () => void }[];
};

/* ------------------------------------------------------------------
 * Status & Action Mapping
 * ------------------------------------------------------------------*/

const toThaiStatus = (rentalStatus: string, paymentStatus?: string): string => {
  switch (rentalStatus) {
    case "Pending":
      return "ขอเช่า"; // ยังไม่ยืนยันคำขอจากผู้ให้เช่า

    case "Active": {
      // เช็คสถานะย่อยจาก payment
      if (paymentStatus === "Pending") return "ยืนยันคำขอแล้ว"; // รอยืนยันชำระ
      if (paymentStatus === "Paid") return "ชำระเงินแล้ว"; // ชำระแล้ว รอส่งของ
      return "ถูกเช่าอยู่"; // อยู่ระหว่างการเช่า
    }

    case "Returned":
      return "กำลังส่งคืน";

    case "Failed":
      return "ยกเลิก";

    default:
      return "สำเร็จแล้ว"; // fallback
  }
};

const toActions = (status: string, id: string) => {
  switch (status) {
    case "ขอเช่า":
      return [
        { label: "ยืนยันคำขอ", href: `/approve/${id}` },
        { label: "ปฏิเสธคำขอ", href: `/reject/${id}` },
      ];

    case "ยืนยันคำขอแล้ว":
      return [{ label: "รอผู้เช่าชำระเงิน" }];

    case "ชำระเงินแล้ว":
      return [{ label: "ยืนยันการส่ง", href: `/confirm-shipping/${id}` }];

    case "กำลังส่งคืน":
      return [
        { label: "ยืนยันการส่งคืน", href: `/confirm-return/${id}` },
        { label: "ระบุค่าปรับ", href: `/penalty/${id}` },
      ];

    case "ผู้เช่าชำระค่าปรับแล้ว":
    case "สำเร็จแล้ว":
      return [{ label: "ให้คะแนนผู้เช่า", href: `/rate-renter/${id}` }];

    default:
      return [];
  }
};

/* ------------------------------------------------------------------
 * Status Group Helpers (ใช้สำหรับแถบ Tabs)
 * ------------------------------------------------------------------*/

const statusGroups: Record<string, (s: string) => boolean> = {
  all: () => true,
  request: (s) => s === "ขอเช่า",
  current: (s) => ["ยืนยันคำขอแล้ว", "ชำระเงินแล้ว", "ถูกเช่าอยู่"].includes(s),
  returning: (s) => s === "กำลังส่งคืน",
  completed: (s) => ["ผู้เช่าชำระค่าปรับแล้ว", "สำเร็จแล้ว"].includes(s),
  cancelled: (s) => s === "ยกเลิก",
};

/* ------------------------------------------------------------------
 * Transform raw mock data -> UI Ready data
 * ------------------------------------------------------------------*/

const rentalsData: RentalItem[] = rentals.map((r) => {
  const item = items.find((i) => i.id === r.item_id);
  const payment = payments.find((p) => p.id === r.payment_id);
  const owner = users.find((u) => u.id === item?.owner_id);
  const status = toThaiStatus(r.status, payment?.status);

  // ราคา: ถ้ามี payment ใช้ยอดรวม ไม่งั้น fallback เป็น price_per_day
  const price = payment?.total_price ?? item?.price_per_day ?? 0;

  const image =
    item?.item_images?.[0]?.image_url ||
    itemImages.find((img) => img.item_id === item?.id)?.image_url ||
    "";

  return {
    id: r.id,
    name: item?.name || "ชื่อสินค้า",
    store: owner?.user_name || "ชื่อร้าน",
    price,
    status,
    image,
    actions: toActions(status, r.id),
  };
});

/* ------------------------------------------------------------------
 * Card Component
 * ------------------------------------------------------------------*/

const RentalCard = ({ rental }: { rental: RentalItem }) => (
  <Card className="mb-4">
    <div className="flex gap-4">
      <div className="w-24 h-24 bg-gray-100 flex items-center justify-center">
        {rental.image ? (
          <img src={rental.image} alt={rental.name} className="w-full h-full object-cover" />
        ) : (
          <HiOutlineCamera className="text-gray-400 text-3xl" />
        )}
      </div>

      <div className="flex-1">
        <h5 className="text-lg font-semibold">{rental.name}</h5>
        {/* optional: add duration / address here */}
        <Link href={`/lender/rental/${rental.id}`} className="text-sm underline text-gray-500 hover:text-black">
          ดูรายละเอียด
        </Link>
      </div>

      <div className="flex flex-col justify-between text-right items-end gap-1">
        <span className="text-sm text-gray-600">{rental.status}</span>
        <span className="text-lg font-bold">{rental.price.toLocaleString()} บาท</span>
        <div className="flex flex-wrap gap-1 justify-end">
          {rental.actions?.map((action, i) =>
            action.href ? (
              <Link key={i} href={action.href}>
                <Button size="xs" color="gray">
                  {action.label}
                </Button>
              </Link>
            ) : (
              <Button key={i} size="xs" color="gray" onClick={action.onClick}>
                {action.label}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  </Card>
);

/* ------------------------------------------------------------------
 * Scrollable Rental List Component
 * ------------------------------------------------------------------*/

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
      {rentals.length ? (
        rentals.map((r) => <RentalCard key={r.id} rental={r} />)
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-lg">ไม่มีรายการ</p>
        </div>
      )}
    </div>
  </div>
);

/* ------------------------------------------------------------------
 * Page Component
 * ------------------------------------------------------------------*/

const RentalManagement = () => {
  const [search, setSearch] = useState("");

  const filteredByTab = (predicate: (s: string) => boolean) =>
    rentalsData.filter((r) => predicate(r.status)).filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Rental Management</h1>
      <Tabs aria-label="Rental Management Tabs">
        <TabItem title="All">
          <ScrollableRentalList rentals={filteredByTab(statusGroups.all)} search={search} setSearch={setSearch} />
        </TabItem>
        <TabItem title="Rental Requests">
          <ScrollableRentalList rentals={filteredByTab(statusGroups.request)} search={search} setSearch={setSearch} />
        </TabItem>
        <TabItem title="Currently Rented">
          <ScrollableRentalList rentals={filteredByTab(statusGroups.current)} search={search} setSearch={setSearch} />
        </TabItem>
        <TabItem title="Being Returned">
          <ScrollableRentalList rentals={filteredByTab(statusGroups.returning)} search={search} setSearch={setSearch} />
        </TabItem>
        <TabItem title="Rental Completed">
          <ScrollableRentalList rentals={filteredByTab(statusGroups.completed)} search={search} setSearch={setSearch} />
        </TabItem>
        <TabItem title="Cancelled">
          <ScrollableRentalList rentals={filteredByTab(statusGroups.cancelled)} search={search} setSearch={setSearch} />
        </TabItem>
      </Tabs>
    </div>
  );
};

export default RentalManagement;
