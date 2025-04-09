import { UserReviewType } from "@/types/user_review";

export const data: UserReviewType[] = [
	{
		id: "1e7d9f3a-8c3b-4c2a-9f3a-1e7d8c3b4c2a",
		reviewer_id: "2222222222",
		user_id: "1111111111",
		comment: "Great service and very friendly!",
		rating: 5,
		created_at: "2023-10-01 12:30:45",
		updated_at: "2023-10-01 12:30:45",
	},
	{
		id: "2a8c3b4c-1e7d-9f3a-8c3b-4c2a1e7d9f3a",
		reviewer_id: "2222222222",
		user_id: "1111111111",
		comment: "The experience was okay, but could be improved.",
		rating: 3,
		created_at: "2023-10-02 14:15:30",
		updated_at: "2023-10-02 14:15:30",
	},
	{
		id: "3b4c2a1e-7d9f-3a8c-3b4c-2a1e7d9f3a8c",
		reviewer_id: "1111111111",
		user_id: "2222222222",
		comment: "Not satisfied with the service.",
		rating: 2,
		created_at: "2023-10-03 09:45:00",
		updated_at: "2023-10-03 09:45:00",
	},
];
