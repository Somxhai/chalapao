"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";

import Step from "@/components/Rental/step";

import Header from "@/components/Header";

import Link from "next/link";

const Page = () => {
	const { rentalId } = useParams();
	return (
		<>
			<Header>{Step(4)}</Header>
			<main className="container mx-auto px-16 py-8">
				<div className="flex flex-col items-center text-center">
					<div className="flex justify-center mb-6 transform translate-y-4">
						<img
							src="/icons/logo_black.svg"
							alt="Chalapao Icon"
							width={80}
							height={80}
						/>
					</div>
					<h2 className="text-2xl font-semibold mb-1">
						You're All Set!
					</h2>
					<p className="text-xs text-gray-600 mb-2">
						Reference Number:{" "}
						<span className="font-semibold text-black">
							#{rentalId}
						</span>
					</p>
					<p className="text-gray-700 mb-6">
						Thank you! Your item will be on its way shortly.
					</p>
					<Link href="/">
						<button className="px-4 py-2 bg-gray-300 text-sm rounded shadow hover:opacity-90">
							Go Home
						</button>
					</Link>
				</div>
			</main>
		</>
	);
};

export default Page;
