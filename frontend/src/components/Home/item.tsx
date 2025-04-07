import { Card } from "flowbite-react";
import { Item } from "@/types/item"; // adjust path as needed

export default function ItemList({ item }: { item: Item }) {
	return (
		<Card
			key={item.id}
			className="max-w-sm"
			imgAlt={item.name}
			imgSrc={item.item_images[0]?.image_url || "/images/fallback.png"}
		>
			<a href="#" className="mt-auto">
				<h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-1">
					{item.name}
				</h5>
			</a>
			<div className="mb-5 mt-2.5 flex items-center">
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
				<span className="ml-3 rounded bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800 dark:bg-gray-200 dark:text-gray-800">
					{item.item_rating.toFixed(1)}
				</span>
			</div>
			<div className="flex items-center justify-between">
				<span className="text-2xl font-bold text-gray-900 dark:text-white">
					฿{item.price_per_day.toFixed(2)}/day
				</span>
				<a
					href="#"
					className="rounded-lg bg-gray-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
				>
					rent
				</a>
			</div>
		</Card>
	);
}
