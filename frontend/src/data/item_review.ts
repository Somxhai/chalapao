import { ItemReviewType } from "@/types/item_review";

export const data: ItemReviewType[] = [
	{
		id: "review-1",
		user_id: "1111111111",
		item_id: "550e8400-e29b-41d4-a716-446655440000",
		comment:
			"Great camera! The quality is amazing, and it works perfectly.",
		rating: 5,
		created_at: "2024-03-23 14:00:00",
		updated_at: "2024-03-23 14:30:00",
		item_review_images: [
			{
				id: "img-review-1",
				item_review_id: "review-1",
				image_url: "https://example.com/review1-image1.jpg",
				created_at: "2024-03-23 14:00:00",
				updated_at: "2024-03-23 14:30:00",
			},
		],
	},
	{
		id: "review-2",
		user_id: "1111111111",
		item_id: "550e8400-e29b-41d4-a716-446655440001",
		comment: "The tent was spacious and easy to set up. Highly recommend!",
		rating: 4,
		created_at: "2024-03-24 10:00:00",
		updated_at: "2024-03-24 10:15:00",
		item_review_images: [
			{
				id: "img-review-2",
				item_review_id: "review-2",
				image_url: "https://example.com/review2-image1.jpg",
				created_at: "2024-03-24 10:00:00",
				updated_at: "2024-03-24 10:15:00",
			},
		],
	},
];
