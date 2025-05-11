"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import { CategoryType } from "@/types/category";

const Page = () => {
	const { itemId } = useParams<{ itemId?: string }>();
	const router = useRouter();
	const isEdit = itemId !== "create";

	const [form, setForm] = useState({
		name: "",
		description: "",
		category: "",
		price: "",
		per: "Day",
		status: "",
		terms: "",
		penalty: "",
		images: [] as (string | File)[],
	});
	const [loading, setLoading] = useState(true);
	const [categories, setCategories] = useState<CategoryType[]>([]);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const newFiles = Array.from(e.target.files);
			setForm((prev) => ({
				...prev,
				images: newFiles,
			}));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			let response;

			if (!isEdit) {
				const formData = new FormData();
				formData.append(
					"item",
					JSON.stringify({
						item_name: form.name,
						description: form.description,
						rental_terms: form.terms,
						penalty_terms: form.penalty,
						item_status: form.status,
						price_per_day: parseFloat(form.price),
						category_id: form.category,
					})
				);
				form.images.forEach((img) => {
					if (img instanceof File) {
						formData.append("files", img);
					}
				});

				response = await fetch(`/api/item`, {
					method: "POST",
					body: formData,
				});
			} else {
				response = await fetch(`/api/item/${itemId}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						item_name: form.name,
						description: form.description,
						rental_terms: form.terms,
						penalty_terms: form.penalty,
						item_status: form.status,
						price_per_day: parseFloat(form.price),
						category_id: form.category,
					}),
				});
			}

			if (!response.ok) {
				throw new Error("Failed to save item");
			}

			await response.json();
			router.push("/lender/items");
		} catch (error) {
			console.error("Error saving item:", error);
		}
	};

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await fetch("/api/category");
				const data = await res.json();
				setCategories(data);
			} catch (err) {
				console.error("Failed to fetch categories", err);
			}
		};

		const fetchItem = async () => {
			if (!isEdit) {
				setLoading(false);
				return;
			}
			try {
				const response = await fetch(`/api/item/${itemId}`);
				if (!response.ok) throw new Error("Failed to fetch item");

				const data = await response.json();

				// ตรวจสอบว่า data.item, data.images, data.category มีข้อมูลหรือไม่
				const item = data.item;
				const images = data.images || [];
				const categoryId = item.category_id;

				setForm({
					name: item.item_name,
					description: item.description,
					category: categoryId,
					price: item.price_per_day,
					per: "Day",
					status: item.item_status,
					terms: item.rental_terms ?? "",
					penalty: item.penalty_terms ?? "",
					images: images, // เป็น array ของ string (URL path)
				});
			} catch (error) {
				console.error("Error fetching item:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
		if (itemId === "create") {
			setLoading(false);
			return;
		}
		fetchItem();
	}, [itemId, isEdit, router]);

	if (loading) return <div className="text-center py-20">Loading...</div>;

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-white p-6 rounded-lg shadow w-full max-w-3xl mx-auto space-y-6"
		>
			<h2 className="text-xl font-semibold text-black">
				{isEdit ? "Edit Product" : "Add Product"}
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="flex flex-col items-center">
					{form.images.length > 0 ? (
						typeof form.images[0] === "string" ? (
							<Image
								src={`/api/${form.images[0]}`}
								width={128}
								height={128}
								alt="Product"
								className="w-32 h-32 object-cover rounded-lg mb-2"
							/>
						) : (
							<Image
								src={URL.createObjectURL(
									form.images[0] as File
								)}
								width={128}
								height={128}
								alt="Selected preview"
								className="w-32 h-32 object-cover rounded-lg mb-2"
							/>
						)
					) : (
						<div className="w-32 h-32 bg-gray-200 rounded-lg mb-2" />
					)}

					<input
						type="file"
						accept="image/*"
						multiple
						className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded"
						onChange={handleImageChange}
					/>
				</div>

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-black mb-1">
							Product Name
						</label>
						<input
							type="text"
							name="name"
							value={form.name}
							onChange={handleChange}
							className="w-full border px-3 py-2 rounded-lg text-sm"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-black mb-1">
							Product Description
						</label>
						<textarea
							name="description"
							rows={3}
							value={form.description}
							onChange={handleChange}
							className="w-full border px-3 py-2 rounded-lg text-sm"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-black mb-1">
							Category
						</label>
						<select
							name="category"
							value={form.category}
							onChange={handleChange}
							className="w-full border px-3 py-2 rounded-lg text-sm"
							required
						>
							<option value="">Select</option>
							{categories.map((cat) => (
								<option key={cat.id} value={cat.id}>
									{cat.name}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-black mb-1">
							Rental Price (THB) / Day
						</label>
						<input
							type="number"
							name="price"
							value={form.price}
							onChange={handleChange}
							className="w-full border px-3 py-2 rounded-lg text-sm"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-black mb-1">
							Product Status
						</label>
						<select
							name="status"
							value={form.status}
							onChange={handleChange}
							className="w-full border px-3 py-2 rounded-lg text-sm"
							required
						>
							<option value="">Select</option>
							<option value="available">Available</option>
							<option value="unavailable">Unavailable</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-black mb-1">
							Rental Terms and Conditions
						</label>
						<textarea
							name="terms"
							rows={3}
							value={form.terms}
							onChange={handleChange}
							className="w-full border px-3 py-2 rounded-lg text-sm"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-black mb-1">
							Penalty and Fine Conditions
						</label>
						<textarea
							name="penalty"
							rows={3}
							value={form.penalty}
							onChange={handleChange}
							className="w-full border px-3 py-2 rounded-lg text-sm"
						/>
					</div>
				</div>
			</div>

			<div className="flex justify-end gap-3">
				<button
					type="button"
					className="px-4 py-2 bg-gray-300 border rounded-lg text-sm text-gray-600 hover:bg-gray-100"
					onClick={() => router.back()}
				>
					Cancel
				</button>
				<button
					type="submit"
					className="bg-gray-700 text-white px-6 py-2 rounded-lg"
				>
					Save
				</button>
			</div>
		</form>
	);
};

export default Page;
