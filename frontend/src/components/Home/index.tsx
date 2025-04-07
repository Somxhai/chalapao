import Sort from "./sort";
import ItemCard from "./item";
import { Item } from "@/types/item";

const Home = ({ items }: { items: Item[] }) => {
	return (
		<main className="container mx-auto px-16 py-8">
			<div className="flex justify-between mb-6">
				<h1 className="text-3xl font-bold">Popular Items</h1>
				<Sort {...items} />
			</div>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{items.map((item) => (
					<ItemCard key={item.id} item={item} />
				))}
			</div>
		</main>
	);
};

export default Home;
