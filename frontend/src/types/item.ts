import { KeywordType } from "./keyword";
import { ItemReviewType } from "./item_review";

export interface ItemType {
	id: string; // UUID, รหัสสินค้า, Example: 550e8400-e29b-41d4-a716-446655440000
	owner_id: string; // UUID, รหัสเจ้าของสินค้า, Example: 36128b7f-da99-4e10-9f4d-605b1abb61b2
	category_id: string; // UUID, รหัสหมวดหมู่สินค้า, Example: 88888888-8888-4888-b888-888888888888
	item_name: string; // TEXT, ชื่อสินค้า, Example: Camping Stove
	description: string; // TEXT, คำอธิบายสินค้า, Example: Portable gas stove.
	rental_terms: string; // TEXT, ข้อกำหนดการเช่า, Example: Return in 5 days.
	penalty_terms: string; // TEXT, ข้อกำหนดเรื่องปรับสินค้า, Example: Damage costs 500.
	item_status: string; // TEXT, สถานะสินค้า, Example: available
	price_per_day: number; // NUMERIC, ราคาเช่าต่อวัน, Example: 80
	created_at: string; // TIMESTAMPTZ, วันที่สร้าง, Format: YYYY-MM-DDTHH:MI:SSZ, Example: 2025-04-28T11:22:14.151Z
	updated_at: string; // TIMESTAMPTZ, วันที่อัปเดต, Format: YYYY-MM-DDTHH:MI:SSZ, Example: 2025-04-28T11:22:14.151Z
	images: string[]; // รูปภาพสินค้า, Example: ["image/item/is0h0586-34ca-4b11-90c6-3eacfe1b05e8.jpg"]
	keywords: KeywordType[] | null; // คีย์เวิร์ดสินค้า, Example: []
	item_reviews: ItemReviewType[]; // รีวิวสินค้า, Example: []
	item_rating: number; // FLOAT(0-5), คะแนนเฉลี่ยของผู้ใช้, Example: 4
}
