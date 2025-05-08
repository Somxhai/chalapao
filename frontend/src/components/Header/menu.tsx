"use client";

import {
	Dropdown,
	DropdownDivider,
	DropdownHeader,
	DropdownItem,
	NavbarToggle,
} from "flowbite-react";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "@/lib/auth-client";

import { UserType } from "@/types/user";

const Menu = () => {
	const session = useSession();
	const [user, setUser] = useState<UserType>();

	useEffect(() => {
		if (session?.data?.user) {
			const fetchUser = async () => {
				try {
					const response = await fetch(
						`/api/user/info/${session?.data?.user.id}`
					);
					if (!response.ok) {
						throw new Error("Failed to fetch user info");
					}
					const data = await response.json();
					setUser(data);
				} catch (error) {
					console.error("Error fetching user info:", error);
				}
			};

			fetchUser();
		}
	}, [session]);

	const signOutBtn = () => {
		signOut();
		window.location.href = "/auth/sign-in";
	};

	return (
		<>
			<Link
				href="/rentals"
				className="inline-flex items-center rounded-lg p-2 text-gray-500
				hover:bg-gray-100 focus:outline-none focus:ring-2
				focus:ring-gray-200 dark:text-gray-400
				dark:hover:bg-gray-700 dark:focus:ring-gray-600"
			>
				<svg
					width="33"
					height="34"
					viewBox="0 0 33 34"
					className="h-8"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M4.91414 16.6762C4.91414 13.4947 4.91253 10.3123 4.91414 7.13083C4.91575 5.10957 6.2185 3.52739 8.17262 3.17907C8.4185 3.13573 8.67324 3.13492 8.92396 3.13492C13.9713 3.13246 19.0186 3.13165 24.066 3.13328C26.4337 3.1341 28.0847 4.81276 28.0847 7.21423C28.0847 13.5675 28.0863 19.9215 28.0847 26.2747C28.0847 27.8594 26.8698 29.0556 25.3599 28.9714C24.6682 28.9321 24.0966 28.5871 23.538 28.2232C22.24 27.3778 20.9687 27.408 19.67 28.2437C17.5434 29.6116 15.3918 29.6083 13.2635 28.2437C11.9841 27.4227 10.733 27.3949 9.45441 28.233C8.89091 28.6026 8.31531 28.964 7.60428 28.982C6.09596 29.0196 4.91817 27.8765 4.91575 26.3442C4.91091 23.1218 4.91414 19.8986 4.91414 16.6762ZM7.49384 26.354C7.58977 26.3115 7.63653 26.2952 7.67845 26.2706C7.86064 26.1627 8.04202 26.0532 8.2226 25.9436C10.3452 24.6549 12.459 24.6705 14.5654 25.9869C14.8041 26.1357 15.0427 26.296 15.3007 26.4007C16.3761 26.8332 17.4031 26.7138 18.3778 26.0818C20.5431 24.677 22.7286 24.6402 24.9326 25.9918C25.1269 26.1112 25.3252 26.224 25.5493 26.3565C25.559 26.2453 25.5711 26.1774 25.5711 26.1096C25.5711 19.776 25.5735 13.4432 25.5695 7.10957C25.5695 6.27065 25.035 5.73672 24.2014 5.73672C19.0936 5.73345 13.9858 5.73181 8.8772 5.74407C8.60956 5.74407 8.31612 5.83238 8.08153 5.96566C7.61315 6.23058 7.48981 6.69174 7.48981 7.2175C7.49545 13.4792 7.49303 19.7416 7.49303 26.0033C7.49303 26.1047 7.49303 26.2061 7.49303 26.354H7.49384Z"
						fill="currentColor"
					/>
					<path
						d="M16.4875 16.1856C14.7784 16.1856 13.0694 16.1897 11.3603 16.1832C10.7315 16.1807 10.2237 15.7588 10.0987 15.1619C9.97295 14.5625 10.2446 13.9624 10.7912 13.7138C10.9863 13.6247 11.2168 13.5748 11.4313 13.5748C14.8091 13.5666 18.1877 13.5666 21.5655 13.5707C22.3603 13.5715 22.944 14.1415 22.94 14.8847C22.9359 15.6345 22.3547 16.184 21.555 16.1848C19.8661 16.1872 18.1772 16.1848 16.4875 16.1848V16.1856Z"
						fill="currentColor"
					/>
					<path
						d="M16.5146 8.35159C18.2236 8.35159 19.9327 8.3475 21.6417 8.35404C22.306 8.35649 22.8115 8.80866 22.9179 9.46606C23.0162 10.0752 22.6591 10.6868 22.0698 10.8831C21.9013 10.9395 21.7151 10.964 21.5377 10.9648C18.1801 10.9697 14.8216 10.9681 11.464 10.9689C10.8916 10.9689 10.4418 10.7457 10.1911 10.211C9.96374 9.72608 10.0282 9.25429 10.358 8.83401C10.6256 8.49304 10.9892 8.34995 11.418 8.35077C13.1174 8.35404 14.816 8.35241 16.5154 8.35241L16.5146 8.35159Z"
						fill="currentColor"
					/>
					<path
						d="M13.9458 18.8046C14.8092 18.8046 15.6734 18.7939 16.5368 18.8078C17.1825 18.8185 17.7041 19.3058 17.771 19.9248C17.8435 20.5944 17.4727 21.175 16.852 21.354C16.7472 21.3843 16.6343 21.399 16.5255 21.399C14.7882 21.4015 13.0501 21.4088 11.3129 21.3966C10.6446 21.3917 10.1456 20.8962 10.069 20.2183C10.0013 19.6173 10.4019 19.018 10.9985 18.8528C11.1508 18.8103 11.3161 18.8046 11.4749 18.8038C12.2988 18.7989 13.1219 18.8013 13.9458 18.8013V18.8038V18.8046Z"
						fill="currentColor"
					/>
				</svg>
			</Link>
			<Dropdown
				arrowIcon={false}
				inline
				label=""
				renderTrigger={() => (
					<button
						type="button"
						className="inline-flex items-center rounded-lg p-2 text-gray-500
				hover:bg-gray-100 focus:outline-none focus:ring-2
				focus:ring-gray-200 dark:text-gray-400
				dark:hover:bg-gray-700 dark:focus:ring-gray-600"
					>
						<svg
							className="h-8"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							fill="none"
							viewBox="2 2 21 21"
						>
							<path
								stroke="currentColor"
								strokeWidth="1.5"
								d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
							/>
						</svg>
					</button>
				)}
			>
				{session?.data ? (
					<>
						<DropdownHeader>
							<span className="block text-sm">
								{user?.first_name} {user?.last_name}
							</span>
						</DropdownHeader>
						<DropdownDivider />
						<DropdownItem onClick={signOutBtn}>
							Sign Out
						</DropdownItem>
					</>
				) : (
					<>
						<DropdownItem>
							<Link href="/auth/sign-in">Sign In</Link>
						</DropdownItem>
						<DropdownItem>
							<Link href="/auth/sign-up">Sign Up</Link>
						</DropdownItem>
					</>
				)}
			</Dropdown>

			<NavbarToggle />
		</>
	);
};

export default Menu;
