import { Dropdown, DropdownItem } from "flowbite-react";
import { Item } from "@/types/item";

const Sort = (items: Item[]) => {
	return (
		<Dropdown label="Sort by" inline>
			<DropdownItem
				onClick={() =>
					items.sort((a, b) => a.name.localeCompare(b.name))
				}
			>
				Name
			</DropdownItem>
			<DropdownItem
				onClick={() =>
					items.sort((a, b) => a.price_per_day - b.price_per_day)
				}
			>
				Price (Low to High)
			</DropdownItem>
			<DropdownItem
				onClick={() =>
					items.sort((a, b) => b.price_per_day - a.price_per_day)
				}
			>
				Price (High to Low)
			</DropdownItem>
			<DropdownItem
				onClick={() =>
					items.sort(
						(a, b) =>
							new Date(b.created_at).getTime() -
							new Date(a.created_at).getTime()
					)
				}
			>
				Newest
			</DropdownItem>
		</Dropdown>
	);
};

export default Sort;
