import { PaymentType } from "@/types/payment";

export const data: PaymentType[] = [
	{
		id: "1e7b9c8e-8f3b-4a2b-9c8e-1e7b9c8e8f3b",
		renter_id: "1111111111",
		total_price: 1500.75,
		status: "Paid",
		created_at: "2023-10-01 10:30:00",
		updated_at: "2023-10-01 10:30:00",
	},
	{
		id: "2a6d8c9f-7b4a-3c2d-8a6d-2a6d8c9f7b4a",
		renter_id: "1111111111",
		total_price: 2500.0,
		status: "Pending",
		created_at: "2023-10-02 14:45:00",
		updated_at: "2023-10-02 14:45:00",
	},
	{
		id: "3c5e7a8d-6f2b-1c3d-7a8d-3c5e7a8d6f2b",
		renter_id: "1111111111",
		total_price: 3200.5,
		status: "Failed",
		created_at: "2023-10-03 09:15:00",
		updated_at: "2023-10-03 09:15:00",
	},
];
