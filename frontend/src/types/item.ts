import { ItemImageType } from "./item_image";
import { KeywordType } from "./keyword";
import { ItemReviewType } from "./item_review";

export interface ItemType {
	id: string; // UUID, รหัสสินค้า, Example: 550e8400-e29b-41d4-a716-446655440000
	owner_id: string; // VARCHAR(10), รหัสเจ้าของสินค้า, Example: 1111111111
	category_id: string; // UUID, รหัสหมวดหมู่สินค้า, Example: 550e8400-e29b-41d4-a716-446655440000
	item_name: string; // TEXT, ชื่อสินค้า, Example: JuadJuad
	description: string; // TEXT, คำอธิบายสินค้า, Example: ของแท้ไม่ปลอม
	rental_terms: string; // TEXT, ข้อกำหนดการเช่า, Example: ยืมขั้นต่ำ 10 ปี
	penalty_terms: string; // TEXT, ข้อกำหนดเรื่องปรับสินค้า, Example: ส่งคืนช้ามีค่าปรับ 1 แสน
	item_status: string; // TEXT, สถานะสินค้า, Example: สิ้นค้าหมด
	price_per_day: number; // NUMERIC, ราคาเช่าต่อวัน, Example: 50.00
	created_at: string; // TIMESTAMPTZ, วันที่สร้าง, Format: YYYY-MM-DD HH:MI:SS, Example: 2024-03-22 22:17:30
	updated_at: string; // TIMESTAMPTZ, วันที่อัปเดต, Format: YYYY-MM-DD HH:MI:SS, Example: 2024-03-22 22:19:00
	item_images: ItemImageType[] | []; // รูปภาพสินค้า
	keywords: KeywordType[] | []; // คีย์เวิร์ดสินค้า
	item_reviews: ItemReviewType[] | []; // รีวิวสินค้า
	item_rating: number | 0; // FLOAT(0-5), คะแนนเฉลี่ยของผู้ใช้
}
