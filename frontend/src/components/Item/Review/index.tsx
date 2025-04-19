"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ItemType } from "@/types/item";

type Props = {
  item: ItemType;
};

const ReviewForm = ({ item }: Props) => {
  const [itemRating, setItemRating] = useState(0);
  const [ownerRating, setOwnerRating] = useState(0);
  const [description, setDescription] = useState("");
  const [ownerFeedback, setOwnerFeedback] = useState("");

  return (
    <section className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-10">
        <h1 className="text-2xl font-semibold">Review</h1>

        {/* Top Section: Image + Info */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Item Image */}
          <div className="flex-shrink-0 flex justify-center">
            <Image
              src={item.item_images[0]?.image_url || "/default.png"}
              alt={item.name}
              width={220}
              height={220}
              className="rounded object-contain max-h-[220px]"
            />
          </div>

          {/* Item Info */}
          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">รายละเอียดการเช่า</p>

            <div>
              <p className="font-medium">คะแนนสินค้า :</p>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setItemRating(star)}
                    className={`text-2xl cursor-pointer ${
                      star <= itemRating ? "text-yellow-400" : "text-gray-400"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-medium mt-4">คะแนนผู้ให้เช่า :</p>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setOwnerRating(star)}
                    className={`text-2xl cursor-pointer ${
                      star <= ownerRating ? "text-yellow-400" : "text-gray-400"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Review Form Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="font-medium block">คำบรรยายสินค้า</label>
            <textarea
              className="w-full p-4 border rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="font-medium block">คำบรรยายผู้ให้เช่า</label>
            <textarea
              className="w-full p-4 border rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
              rows={3}
              value={ownerFeedback}
              onChange={(e) => setOwnerFeedback(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="font-medium block">รูปภาพประกอบ</label>
            <button className="px-4 py-2 text-sm rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600">
              เพิ่มรูปภาพ
            </button>
          </div>

          <div className="flex justify-end">
            <button className="bg-black text-white px-6 py-2 rounded hover:opacity-90">
              Save
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewForm;
