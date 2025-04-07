"use client";

import Home from "@/components/Home";
import { Item } from "@/types/item";

const Page = () => {
	const items: Item[] = [
		{
			id: "550e8400-e29b-41d4-a716-446655440000",
			owner_id: "1111111111",
			category_id: "11111111-aaaa-bbbb-cccc-111111111111",
			name: "Olympus MJU II Film Camera",
			description: "Rare film camera, fully functional with strap.",
			rental_terms: "Minimum rental period: 3 days.",
			penalty_terms: "Late return penalty: 200 THB per day.",
			item_status: "Available for rent",
			price_per_day: 150.0,
			created_at: "2024-03-22 10:00:00",
			updated_at: "2024-03-22 12:00:00",
			item_images: [
				{
					id: "img-550e8400-e29b-41d4-a716-446655440000",
					item_id: "550e8400-e29b-41d4-a716-446655440000",
					image_url:
						"https://cdn02.pinkoi.com/product/7yrggRgG/0/1/640x530.jpg",
					created_at: "2024-03-22 10:00:00",
					updated_at: "2024-03-22 12:00:00",
				},
			],
			keywords: [],
			item_reviews: null,
			item_rating: 4.7,
		},
		{
			id: "550e8400-e29b-41d4-a716-446655440001",
			owner_id: "1111111112",
			category_id: "22222222-bbbb-cccc-dddd-222222222222",
			name: "Quechua 4-Person Tent",
			description: "Waterproof tent, great for outdoor use.",
			rental_terms: "Minimum rental period: 2 days.",
			penalty_terms: "Damage repair costs will be charged.",
			item_status: "Available for rent",
			price_per_day: 100.0,
			created_at: "2024-03-22 09:15:00",
			updated_at: "2024-03-22 09:20:00",
			item_images: [
				{
					id: "img-550e8400-e29b-41d4-a716-446655440001",
					item_id: "550e8400-e29b-41d4-a716-446655440001",
					image_url:
						"https://down-th.img.susercontent.com/file/7c36c93575ef66d4450d1959a6eb7f51",
					created_at: "2024-03-22 09:15:00",
					updated_at: "2024-03-22 09:20:00",
				},
			],
			keywords: [],
			item_reviews: null,
			item_rating: 4.2,
		},
		{
			id: "550e8400-e29b-41d4-a716-446655440002",
			owner_id: "1111111113",
			category_id: "33333333-cccc-dddd-eeee-333333333333",
			name: "Makita Electric Screwdriver",
			description: "High torque screwdriver with spare battery.",
			rental_terms: "Minimum rental period: 1 day.",
			penalty_terms: "Damage penalty: 500 THB.",
			item_status: "Out of stock",
			price_per_day: 80.0,
			created_at: "2024-03-21 14:30:00",
			updated_at: "2024-03-21 16:00:00",
			item_images: [
				{
					id: "img-550e8400-e29b-41d4-a716-446655440002",
					item_id: "550e8400-e29b-41d4-a716-446655440002",
					image_url:
						"https://image.makewebeasy.net/makeweb/0/CKCRqfjVX/DefaultData/_MAKITA_M011_TD0101F.jpg?v=202405291424",
					created_at: "2024-03-21 14:30:00",
					updated_at: "2024-03-21 16:00:00",
				},
			],
			keywords: [],
			item_reviews: null,
			item_rating: 3,
		},
		{
			id: "550e8400-e29b-41d4-a716-446655440003",
			owner_id: "1111111114",
			category_id: "44444444-dddd-eeee-ffff-444444444444",
			name: "Epson Full HD Projector",
			description: "High-resolution projection with HDMI support.",
			rental_terms: "Minimum rental period: 1 day.",
			penalty_terms: "Late return penalty: 300 THB per day.",
			item_status: "Available for rent",
			price_per_day: 200.0,
			created_at: "2024-03-20 18:00:00",
			updated_at: "2024-03-20 18:30:00",
			item_images: [
				{
					id: "img-550e8400-e29b-41d4-a716-446655440003",
					item_id: "550e8400-e29b-41d4-a716-446655440003",
					image_url:
						"https://img.advice.co.th/images_nas/pic_product4/A0138348/A0138348OK_BIG_3.jpg",
					created_at: "2024-03-20 18:00:00",
					updated_at: "2024-03-20 18:30:00",
				},
			],
			keywords: [],
			item_reviews: null,
			item_rating: 4.5,
		},
		{
			id: "550e8400-e29b-41d4-a716-446655440004",
			owner_id: "1111111115",
			category_id: "55555555-eeee-ffff-aaaa-555555555555",
			name: "Philips Air Fryer",
			description: "Perfect for health-conscious cooking, easy to use.",
			rental_terms: "Minimum rental period: 2 days.",
			penalty_terms: "Burn marks penalty: 1000 THB.",
			item_status: "Available for rent",
			price_per_day: 120.0,
			created_at: "2024-03-22 13:10:00",
			updated_at: "2024-03-22 13:15:00",
			item_images: [
				{
					id: "img-550e8400-e29b-41d4-a716-446655440004",
					item_id: "550e8400-e29b-41d4-a716-446655440004",
					image_url:
						"https://static.siamtv.com/media/catalog/product/cache/ac5899292bba0d707f548a520a8c41b3/F/R/FRYR-PH1-NA110_00_4_240914_220724.jpeg",
					created_at: "2024-03-22 13:10:00",
					updated_at: "2024-03-22 13:15:00",
				},
			],
			keywords: [],
			item_reviews: null,
			item_rating: 4.8,
		},
		{
			id: "550e8400-e29b-41d4-a716-446655440005",
			owner_id: "1111111116",
			category_id: "66666666-ffff-aaaa-bbbb-666666666666",
			name: "Lenovo Yoga Laptop",
			description: "Touchscreen, foldable, ideal for presentations.",
			rental_terms: "Minimum rental period: 3 days.",
			penalty_terms: "Screen damage penalty: 3000 THB.",
			item_status: "Available for rent",
			price_per_day: 350.0,
			created_at: "2024-03-22 08:45:00",
			updated_at: "2024-03-22 09:00:00",
			item_images: [
				{
					id: "img-550e8400-e29b-41d4-a716-446655440005",
					item_id: "550e8400-e29b-41d4-a716-446655440005",
					image_url:
						"https://media-cdn.bnn.in.th/408054/lenovo-yoga-slim-7-14imh9-83cv002sta-1-square_medium.jpg",
					created_at: "2024-03-22 08:45:00",
					updated_at: "2024-03-22 09:00:00",
				},
			],
			keywords: [],
			item_reviews: null,
			item_rating: 4.9,
		},
		{
			id: "550e8400-e29b-41d4-a716-446655440006",
			owner_id: "1111111117",
			category_id: "77777777-aaaa-bbbb-cccc-777777777777",
			name: "GoPro Hero 10 Camera",
			description: "Waterproof, 5K video recording with accessories.",
			rental_terms: "Minimum rental period: 2 days.",
			penalty_terms: "Misuse penalty: 1000 THB.",
			item_status: "Available for rent",
			price_per_day: 250.0,
			created_at: "2024-03-21 12:00:00",
			updated_at: "2024-03-21 12:30:00",
			item_images: [
				{
					id: "img-550e8400-e29b-41d4-a716-446655440006",
					item_id: "550e8400-e29b-41d4-a716-446655440006",
					image_url:
						"https://www.digital2home.com/wp-content/uploads/2021/09/1631822665_IMG_1606164-510x510.jpg",
					created_at: "2024-03-21 12:00:00",
					updated_at: "2024-03-21 12:30:00",
				},
			],
			keywords: [],
			item_reviews: null,
			item_rating: 4,
		},
		{
			id: "550e8400-e29b-41d4-a716-446655440007",
			owner_id: "1111111118",
			category_id: "88888888-bbbb-cccc-dddd-888888888888",
			name: "JBL Bluetooth Speaker",
			description: "Great sound, deep bass, 12-hour battery life.",
			rental_terms: "Minimum rental period: 1 day.",
			penalty_terms: "Damage penalty: 800 THB.",
			item_status: "Out of stock",
			price_per_day: 90.0,
			created_at: "2024-03-20 10:15:00",
			updated_at: "2024-03-20 11:00:00",
			item_images: [
				{
					id: "img-550e8400-e29b-41d4-a716-446655440007",
					item_id: "550e8400-e29b-41d4-a716-446655440007",
					image_url:
						"https://www.atprosound.com/wp-content/uploads/2020/05/Party-Box-300_01.jpg",
					created_at: "2024-03-20 10:15:00",
					updated_at: "2024-03-20 11:00:00",
				},
			],
			keywords: [],
			item_reviews: null,
			item_rating: 4.3,
		},
	];

	return <Home items={items} />;
};

export default Page;
