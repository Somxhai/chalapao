"use client";

import { data as addresses } from "@/data/address";
import { data as categories } from "@/data/category";
import { data as items } from "@/data/item";
import { data as itemImages } from "@/data/item_image";
import { data as itemReviews } from "@/data/item_review";
import { data as itemReviewImages } from "@/data/item_review_image";
import { data as keywords } from "@/data/keyword";
import { data as payments } from "@/data/payment";
import { data as rentals } from "@/data/rental";
import { data as users } from "@/data/user";
import { data as userReviews } from "@/data/user_review";

import React from 'react';
import Image from 'next/image'; // ใช้ Next.js Image component ถ้าต้องการ optimization
import { useState } from "react";

const Items = () => {
  const [items] = useState([
    {
      id: 1,
      name: "ชื่อสินค้า",
      description: "รายละเอียด",
      views: "ยอดเช่า",
      price: 1800,
      status: "ว่าง",
      rating: 4.5,
    },
    {
      id: 2,
      name: "กล้อง DSLR",
      description: "รายละเอียด",
      views: "ยอดเช่า",
      price: 2500,
      status: "ไม่ว่าง",
      rating: 3.8,
    },
    {
      id: 3,
      name: "โปรเจกเตอร์พกพา",
      description: "รายละเอียด",
      views: "ยอดเช่า",
      price: 1200,
    },
    {
      id: 4,
      name: "ชุดไฟสตูดิโอ",
      description: "รายละเอียด",
      views: "ยอดเช่า",
      price: 1500,
    },
    {
      id: 5,
      name: "ไมค์บูมบันทึกเสียง",
      description: "รายละเอียด",
      views: "ยอดเช่า",
      price: 800,
    },
  ]);

  return (
    <main className="bg-[#EFEFEF] min-h-screen py-8 px-4">
      <div className="w-full max-w-6xl mx-auto px-6">
        <h1 className="text-2xl text-[#000000] font-bold mb-6">Rental Item Management</h1>

        {/* Tabs */}
        <div className="flex justify-center gap-20 mb-5 text-sm font-medium border-b border-gray-200">
          <button className="border-b border-black pb-1">All</button>
          <button className="text-[#949494] hover:text-black">Currently Rented</button>
          <button className="text-[#949494] hover:text-black">Available for Rent</button>
          <button className="text-[#949494] hover:text-black">Returned</button>
          <button className="bg-[#C0C0C0] text-353535 px-4 py-2 rounded-md hover:bg-gray-600">Add New </button>
        </div>

        {/* Item Card */}
        <div className="bg-white p-6 rounded-xl shadow-md w-full md:w-3/4 mx-auto">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="ค้นหา..."
              className="border border-gray-300 px-4 py-2 rounded-md w-1/3"
            />

            <div className="flex items-center gap-2 text-sm text-[#717171]">
              <span>Sort by :</span>
              <select className="bg-transparent outline-none text-[#717171] font-medium cursor-pointer">
                <option>Latest</option>
                <option>Rating</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4"
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                <img
                  src={`https://placehold.co/64x64?text=${item.id}`}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <div className="text-base text-[#353535] font-bold mb-1">{item.name}</div>
                  <div className="text-sm text-[#353535] ml-4 mb-1">{item.description}</div>
                  <div className="text-sm text-[#353535] ml-4 ">{item.views}</div>
                </div>
              </div>

              {/* Right */}
              <div className="text-right">
                <div className="text-sm text-[#545454] mb-1">
                  สถานะ: {" "}
                  <span className={item.status === "ว่าง" ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                    {item.status}
                  </span>{" "}
                  | คะแนน: {" "}
                  <span className="text-yellow-600 font-medium">{item.rating}</span>
                </div>
                <div className="font-bold text-[#2D2D2D] mb-2">{item.price} บาท/เดือน</div>
                <div className="flex gap-2 justify-end">
                  <button className="bg-[#D9D9D9] text-[#353535] px-3 py-1 rounded-md">
                    แก้ไขข้อมูล
                  </button>
                  <button className="bg-[#D9D9D9] text-[#353535] px-3 py-1 rounded-md">
                    ลบผลิตภัณฑ์
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Items;