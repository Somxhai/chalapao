"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

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
		images: [] as (string | File)[], // accept File or string
	});
	const [loading, setLoading] = useState(true);

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
			const file = e.target.files[0];
			setForm((prev) => ({
				...prev,
				images: [file], // replace with new file
			}));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			let response;

			// prepare FormData for create (POST)
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

				// add file if selected
				if (form.images.length > 0 && form.images[0] instanceof File) {
					formData.append("files", form.images[0] as File);
				}

				response = await fetch(`/api/item`, {
					method: "POST",
					body: formData,
				});
			} else {
				// update (PUT) without uploading new file
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

			const data = await response.json();
			console.log("Item saved successfully:", data);
			router.push("/lender/items");
		} catch (error) {
			console.error("Error saving item:", error);
		}
	};

	useEffect(() => {
		if (itemId === "create") {
			setLoading(false);
			return;
		}
		const fetchItem = async () => {
			if (!isEdit) {
				setLoading(false);
				return;
			}
			try {
				const response = await fetch(`/api/item/${itemId}`);
				if (!response.ok) throw new Error("Failed to fetch item");
				const data = await response.json();
				setForm({
					name: data.item_name,
					description: data.description,
					category: data.category_id,
					price: data.price_per_day.toString(),
					per: "Day",
					status: data.item_status,
					terms: data.rental_terms ?? "",
					penalty: data.penalty_terms ?? "",
					images: data.images || [],
				});
			} catch (error) {
				console.error("Error fetching item:", error);
			} finally {
				setLoading(false);
			}
		};

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
							<img
								src={`http://localhost:8787/${form.images[0]}`}
								alt="Product"
								className="w-32 h-32 object-cover rounded-lg mb-2"
							/>
						) : (
							<img
								src={URL.createObjectURL(
									form.images[0] as File
								)}
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
							<option value="77777777-7777-4777-b777-777777777777">
								Camera
							</option>
							<option value="77777777-7777-5777-b777-777777777777">
								Technology
							</option>
							<option value="77777777-7777-6777-b777-777777777777">
								Clothing
							</option>
							<option value="77777777-7777-7777-b777-777777777777">
								Books
							</option>
							<option value="88888888-8888-4888-b888-888888888888">
								Camping Gear
							</option>
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
					className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm"
				>
					Save
				</button>
			</div>
		</form>
	);
};

export default Page;
