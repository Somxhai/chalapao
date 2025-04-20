"use client";

import { useState } from "react";
import Link from "next/link";

import { data as addresses } from "@/data/address";
import { data as categories } from "@/data/category";
import { data as items } from "@/data/item";
import { data as itemImages } from "@/data/item_image";
import { data as userReviews } from "@/data/user_review";
import { data as users } from "@/data/user";

const userId = "2222222222";
const shop = users.find((u) => u.id === userId);
const address = shop?.address.find((a) => a.is_primary);

const Shop = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showAllItems, setShowAllItems] = useState(false);

  // กรองสินค้าตามเจ้าของและหมวดหมู่ที่เลือก
  const filteredItems = items.filter((item) => {
    const isOwner = item.owner_id === userId;
    const inCategory = selectedCategoryId
      ? item.category_id === selectedCategoryId
      : true;

    console.log("selectedCategoryId:", selectedCategoryId, "item.category_id:", item.category_id);
    return isOwner && inCategory;
  });

  const itemsToShow = showAllItems ? filteredItems : filteredItems.slice(0, 3);

  const shopReviewsWithReviewer = userReviews
    .filter((r) => r.user_id === userId)
    .map((r) => {
      const reviewer = users.find((u) => u.id === r.reviewer_id);
      return {
        ...r,
        reviewer_name: `${reviewer?.first_name || "ไม่ทราบ"} ${reviewer?.last_name || ""}`,
      };
    });

  const getFirstImage = (itemId: string) =>
    itemImages.find((img) => img.item_id === itemId)?.image_url || "/default-image.png";

  return (
    <div className="pb-16">
      {/* ส่วนหัวร้าน */}
      <div className="flex justify-between items-start p-6 w-full max-w-[1200px] mx-auto border-b border-gray-300 mb-8">
        <div className="flex-shrink-0">
          <img
            src={shop?.image_url || "/default-logo.png"}
            alt={shop?.user_name}
            className="w-20 h-20 rounded-full object-cover"
          />
        </div>

        <div className="flex-1 text-left px-10">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">
              {shop?.first_name} {shop?.last_name}
            </h2>
            <span className="text-yellow-500">⭐</span>
            <span className="text-lg font-medium">
              {shop?.user_rating?.toFixed(0) || "–"}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ให้บริการเช่าอุปกรณ์ครบวงจร พร้อมคำแนะนำจากมืออาชีพ
          </p>
        </div>

        <div className="w-[400px] text-sm text-gray-500 text-right break-words leading-relaxed">
          <div>ชื่อ: {shop?.first_name} {shop?.last_name}</div>
          <div>โทร: {shop?.phone}</div>
          <div>
            ที่อยู่: {address
              ? `${address.residence_info}, ${address.subdistrict}, ${address.district}, ${address.province} ${address.postal_code}`
              : "ไม่พบที่อยู่"}
          </div>
        </div>
      </div>

      {/* เมนูหมวดหมู่ */}
      <div className="flex gap-6 justify-center pb-4 mb-8">
        <button
          className={`text-md font-medium ${
            selectedCategoryId === null ? "text-black border-b-2 border-black" : "text-gray-500"
          }`}
          onClick={() => {
            setSelectedCategoryId(null);
            setShowAllItems(false);
          }}
        >
          ทั้งหมด
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`text-md font-medium transition duration-300 ease-in-out ${
              selectedCategoryId === cat.id
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-black"
            }`}
            onClick={() => {
              setSelectedCategoryId(cat.id);
              setShowAllItems(false);
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* รายการสินค้า */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-[1200px] mx-auto mb-10">
        {itemsToShow.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            ไม่พบสินค้าในหมวดนี้
          </p>
        ) : (
          itemsToShow.map((item) => (
            <Link key={item.id} href={`/site/item/${item.id}`}>
              <div className="border rounded-lg p-4 shadow-sm cursor-pointer">
                {/* 
                  แทรก container ที่มี aspect-ratio เพื่อให้รูปคงขนาดสม่ำเสมอ
                  - aspect-square => สี่เหลี่ยมจัตุรัส
                  - ใช้ object-contain เพื่อไม่ถูก crop
                */}
                <div className="relative w-full aspect-square mb-2">
                  <img
                    src={getFirstImage(item.id)}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-contain rounded"
                  />
                </div>
                <div className="text-md font-semibold">{item.name}</div>
                <div className="text-sm text-gray-500">
                  {item.price_per_day} บาท / วัน
                </div>
                <div
                  className={`text-xs mt-1 ${
                    item.item_status === "Available" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {item.item_status === "Available" ? "Available" : "Rented"}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {!showAllItems && filteredItems.length > 3 && (
        <div className="flex justify-center mb-12">
          <button
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md"
            onClick={() => setShowAllItems(true)}
          >
            แสดงเพิ่มเติม
          </button>
        </div>
      )}

      {/* รีวิวลูกค้า */}
      <div className="max-w-[1200px] mx-auto mb-10 mt-10 pt-10 border-t border-gray-300 ">
        <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {shopReviewsWithReviewer.map((review) => (
            <div
              key={review.id}
              className="p-4 border rounded-md shadow-sm bg-white text-sm"
            >
              <div className="text-yellow-500 mb-1">
                {"⭐".repeat(review.rating)}
              </div>
              <p className="text-gray-700">{review.comment}</p>
              <p className="mt-2 text-gray-400 text-xs">
                {review.reviewer_name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
