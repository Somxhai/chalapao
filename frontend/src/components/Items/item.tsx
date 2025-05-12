"use client";

import { ItemType } from "@/types/item";
import Image from "next/image";

export default function ItemCard({ item }: { item: ItemType }) {
	return (
		<a
			href={`/item/${item.id}`}
			className="w-full p-4 flex flex-col gap-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
		>
			<div className="flex items-center">
				{[...Array(5)].map((_, i) => (
					<svg
						key={i}
						className={`h-5 w-5 ${
							i < Math.round(item.item_rating)
								? "text-yellow-300"
								: "text-gray-300"
						}`}
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
					</svg>
				))}
				<span className="ms-1">({item.item_rating})</span>
				<span className="ml-auto rounded bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800 dark:bg-gray-200 dark:text-gray-800">
					{item.item_status}
				</span>
			</div>
			<Image
				className="rounded-lg aspect-square w-full object-cover"
				src={`/api/${item.images[0]}`}
				alt={item.item_name}
				width={200}
				height={200}
			/>
			<h5 className="text-xl font-semibold tracking-tight dark:text-white line-clamp-2">
				{item.item_name}
			</h5>
			<h3 className="text-2xl mt-auto font-bold dark:text-white">
				฿{item.price_per_day}/day
			</h3>
		</a>
	);
}

{
	/* <Card
	href={`/item/${item.id}`}
	key={item.id}
	className="max-w-sm"
	imgAlt={item.name}
	imgSrc={item.item_images[0]?.image_url}
>
	<div className="mt-auto">
		<h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-1">
			{item.name}
		</h5>
	</div>
	<div className="flex items-center">
		{[...Array(5)].map((_, i) => (
			<svg
				key={i}
				className={`h-5 w-5 ${
					i < Math.round(item.item_rating)
						? "text-yellow-300"
						: "text-gray-300"
				}`}
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
			</svg>
		))}
		<span>({item.item_rating.toFixed(1)})</span>
		<span className="ml-auto rounded bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800 dark:bg-gray-200 dark:text-gray-800">
			{item.item_status}
		</span>
	</div>
	<div className="flex items-center">
		<span className="text-2xl font-bold text-gray-900 dark:text-white">
			฿{item.price_per_day.toFixed(2)}/day
		</span>
	</div>
</Card>; */
}
