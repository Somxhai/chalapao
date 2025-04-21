// File: app/(renter)/rental/[rentalId]/page.tsx

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, Card } from "flowbite-react";

import { data as rentals } from "@/data/rental";
import { data as items } from "@/data/item";
import { data as itemImages } from "@/data/item_image";
import { data as users } from "@/data/user";
import { data as addresses } from "@/data/address";
import { data as payments } from "@/data/payment";

// ------------------------------------------------------------
// Helper Functions
// ------------------------------------------------------------

const thaiStatus = (rentalStatus: string, paymentStatus?: string): string => {
  if (rentalStatus === "Pending") return "รอผู้ปล่อยเช่ายืนยัน";
  if (paymentStatus === "Pending") return "ผู้ปล่อยเช่ายืนยันแล้ว";
  if (rentalStatus === "Active") return "เช่าอยู่";
  if (rentalStatus === "Returned") return "จัดส่งคืนแล้ว";
  if (paymentStatus === "Failed") return "มีค่าปรับที่ต้องชำระ";
  if (rentalStatus === "Failed") return "ยกเลิกแล้ว";
  return "เช่าสำเร็จแล้ว";
};

const calcDuration = (start?: string, end?: string): string => {
  if (!start || !end) return "-";
  const d1 = new Date(start);
  const d2 = new Date(end);
  const diffDays = Math.ceil((d2.getTime() - d1.getTime()) / 86_400_000);
  return `${diffDays} วัน`;
};

// ------------------------------------------------------------
// Page Component
// ------------------------------------------------------------

const Page = () => {
  const { rentalId } = useParams<{ rentalId: string }>();

  /* ------------------------------ Look‑ups ------------------------------ */
  const rental = rentals.find((r) => r.id === rentalId);
  const item = items.find((i) => i.id === rental?.item_id);
  const owner = users.find((u) => u.id === item?.owner_id);
  const renter = users.find((u) => u.id === rental?.renter_id);
  const renterAddress = addresses.find((a) => a.user_id === renter?.id && a.is_primary);
  const payment = payments.find((p) => p.id === rental?.payment_id);

  // ภาพ: ใช้ item.item_images ถ้ามี ไม่งั้น fallback ไป itemImages table
  const imageUrl =
    item?.item_images?.[0]?.image_url ||
    itemImages.find((img) => img.item_id === item?.id)?.image_url ||
    "";

  if (!rental || !item || !owner || !renter) {
    return (
      <p className="text-center text-red-500 mt-10">ไม่พบข้อมูลการเช่า</p>
    );
  }

  /* ---------------------------- Derived Data --------------------------- */
  const duration = calcDuration(rental.start_date, rental.end_date);
  const statusText = thaiStatus(rental.status, payment?.status);
  const totalPrice = payment?.total_price ?? item.price_per_day;
  const shippingFee = 120; // TODO: store real shipping fee when available

  const fullDeliveryAddress = renterAddress
    ? `${renterAddress.residence_info}, ${renterAddress.subdistrict}, ${renterAddress.district}, ${renterAddress.province}, ${renterAddress.postal_code}`
    : "-";

  /* ------------------------------ UI Render ----------------------------- */
  return (
    <div className="bg-gray-100 min-h-screen px-6 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl p-6 shadow">
        <h1 className="text-2xl font-bold mb-4">
          <Link href="/rentals" className="hover:underline text-blue-600">
            My Rental List
          </Link>{" "}
          &gt;&gt; {item.name}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ------------------------- Left Column ------------------------- */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-semibold mb-1">{item.name}</h2>
            <p className="text-gray-600 mb-6">
              {owner.user_name}{" "}
              <Link href={`/shop/${owner.user_name}`}>
                <span className="text-blue-600 text-sm underline ml-1 hover:text-blue-800">
                  ดูร้านค้า
                </span>
              </Link>
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6 border-b pb-4">
              <div>
                <h3 className="font-bold mb-2">Lender</h3>
                <p>ผู้ให้เช่า : {owner.user_name}</p>
                <p>
                  ชื่อ-สกุล : {owner.first_name} {owner.last_name}
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Renter</h3>
                <p>ผู้เช่า : {renter.user_name}</p>
                <p>
                  ชื่อ-สกุล : {renter.first_name} {renter.last_name}
                </p>
                <p>ที่อยู่จัดส่ง : {fullDeliveryAddress}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Renting</h3>
              <p>ระยะเวลาการเช่า : {duration}</p>
              <p>ตั้งแต่วันที่ : {rental.start_date}</p>
              <p>ถึงวันที่ : {rental.end_date}</p>
              <Link href="/rental-terms">
                <span className="text-blue-600 underline text-sm mt-2 inline-block hover:text-blue-800">
                  อ่านเงื่อนไขการเช่า และการปรับ
                </span>
              </Link>
            </div>
          </div>

          {/* ------------------------- Right Column ------------------------ */}
          <div className="space-y-4">
            <p className="text-lg font-semibold text-right">{statusText}</p>

            <div className="w-full flex justify-center">
              <img
                src={imageUrl}
                alt={item.name}
                className="rounded-md object-contain w-[200px] h-[200px]"
              />
            </div>

            <Card>
              <div className="flex gap-4 mb-2">
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 text-sm">
                  <p className="font-semibold">{item.name}</p>
                  <p>
                    เช่าจาก : {owner.first_name} {owner.last_name}
                  </p>
                  <p>
                    ผู้เช่า : {renter.first_name} {renter.last_name}
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>ค่าเช่า {duration}</span>
                  <span>{item.price_per_day.toLocaleString()} บาท</span>
                </div>
                <div className="flex justify-between">
                  <span>ค่าจัดส่ง</span>
                  <span>{shippingFee.toLocaleString()} บาท</span>
                </div>
                <div className="flex justify-between">
                  <span>รวม</span>
                  <span className="text-lg font-bold">
                    {(totalPrice + shippingFee).toLocaleString()} บาท
                  </span>
                </div>
              </div>
            </Card>

            {/* TODO: Map real actions based on status */}
            <Link href={`/cancel/${rental.id}`}>
              <Button color="gray" className="w-full">
                ยกเลิก
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/rentals">
            <Button color="light">ย้อนกลับไปหน้ารายการเช่า</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
