// src/app/(site)/(pages)/lender/item/[itemId]/edit/page.tsx
"use client";

import React from "react";
import EditItemForm from "@/components/Lender/Item";

const EditItemPage = () => {
  return (
    <main className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <EditItemForm />
      </div>
    </main>
  );
};

export default EditItemPage;
