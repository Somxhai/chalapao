import { Dropdown, DropdownItem } from "flowbite-react";

const Search = () => {
	return (
		<form className="w-full hidden md:flex mr-2">
			<Dropdown
				label=""
				renderTrigger={() => (
					<button
						id="dropdown-button"
						data-dropdown-toggle="dropdown"
						className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center bg-gray-100 border-y border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
						type="button"
					>
						All categories{" "}
						<svg
							className="w-2.5 h-2.5 ms-2.5"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 10 6"
						>
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="m1 1 4 4 4-4"
							/>
						</svg>
					</button>
				)}
			>
				<DropdownItem>Houses</DropdownItem>
				<DropdownItem>Apartments</DropdownItem>
				<DropdownItem>Cars</DropdownItem>
				<DropdownItem>Furniture</DropdownItem>
				<DropdownItem>Electronics</DropdownItem>
				<DropdownItem>Tools</DropdownItem>
				<DropdownItem>Clothing</DropdownItem>
				<DropdownItem>Books</DropdownItem>
			</Dropdown>
			<div className="relative w-full">
				<input
					type="search"
					id="search-dropdown"
					className="block p-2.5 w-full z-20 text-sm bg-gray-50 rounded-e-lg border border-gray-300 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-gray-500"
					placeholder="Search for items..."
					required
				/>
				<button
					type="submit"
					className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-gray-700 rounded-e-lg border border-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
				>
					<svg
						className="w-4 h-4"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 20 20"
					>
						<path
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
						/>
					</svg>
					<span className="sr-only">Search</span>
				</button>
			</div>
		</form>
	);
};

export default Search;
