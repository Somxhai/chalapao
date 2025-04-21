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

import React, { useState } from "react";

const AddEditProductForm = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    per: "Day",
    status: "",
    terms: "",
    penalty: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // handle save
    console.log("Saving", form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 mt-10 rounded-xl shadow-md w-full max-w-4xl mx-auto space-y-6"
    >
      <h2 className="text-xl text-[#000000] font-semibold">Add / Edit Product</h2>

      {/* Main layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Image Upload */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-200 rounded-md mb-2" />
          <button type="button" className="text-xs text-[#6D6D6D] bg-[#EBEBEB] px-2 py-1 rounded">
            Upload Image
          </button>
        </div>

        {/* Right: All Fields */}
        <div className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm text-[#000000] font-medium mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md text-sm"
            />
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-sm text-[#000000] font-medium mb-1">Product Description</label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm text-[#000000] font-medium mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md text-sm"
            >
              <option value="">Select</option>
              <option value="camera">Camera</option>
              <option value="tent">Tent</option>
            </select>
          </div>

          {/* Price + Per */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-[#000000] font-medium mb-1">Rental Price (THB)</label>
              <input
                type="text"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md text-sm"
              />
            </div>
            <div className="w-24">
              <label className="block text-sm text-[#000000] font-medium mb-1">Per</label>
              <select
                name="per"
                value={form.per}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md text-sm"
              >
                <option>Day</option>
                <option>Week</option>
                <option>Month</option>
              </select>
            </div>
          </div>

          {/* Product Status */}
          <div>
            <label className="block text-sm text-[#000000] font-medium mb-1">Product Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md text-sm"
            >
              <option value="">Select</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          {/* Rental Terms */}
          <div>
            <label className="block text-sm text-[#000000] font-medium mb-1">Rental Terms and Conditions</label>
            <textarea
              name="terms"
              rows={3}
              value={form.terms}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md text-sm"
            />
          </div>

          {/* Penalty */}
          <div>
            <label className="block text-sm text-[#000000] font-medium mb-1">Penalty and Fine Conditions</label>
            <textarea
              name="penalty"
              rows={3}
              value={form.penalty}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          className="px-4 py-2 bg-[#D9D9D9] border rounded-md text-sm text-[#505050] hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#262626] text-[#FFFFFF] rounded-md text-sm"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default AddEditProductForm;