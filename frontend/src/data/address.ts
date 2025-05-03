import { AddressType } from "@/types/address";

export const data: AddressType[] = [
	{
		id: "1234567890",
		user_id: "1111111111",
		is_primary: true,
		residence_info: "123/45 Moo 6, Example Street",
		subdistrict: "Example Subdistrict",
		district: "Example District",
		province: "Example Province",
		postal_code: "12345",
		created_at: "2023-01-01 12:00:00",
		updated_at: "2023-01-01 12:00:00",
	},
	{
		id: "0987654321",
		user_id: "2222222222",
		is_primary: false,
		residence_info: "678/90 Moo 1, Another Street",
		subdistrict: "Another Subdistrict",
		district: "Another District",
		province: "Another Province",
		postal_code: "54321",
		created_at: "2023-02-01 12:00:00",
		updated_at: "2023-02-01 12:00:00",
	},
];
