import { ItemReviewImage } from "./item_review_image";

export interface ItemReview {
	id: string; // UUID, รหัสรีวิว
	user_id: string; // VARCHAR(10), รหัสผู้ใช้
	item_id: string; // UUID, รหัสสินค้า
	comment: string; // TEXT, ความคิดเห็น
	rating: number; // INT(0-5), คะแนนรีวิว
	created_at: string; // TIMESTAMPTZ, วันที่สร้าง (format: YYYY-MM-DD HH:MI:SS)
	updated_at: string; // TIMESTAMPTZ, วันที่อัปเดต (format: YYYY-MM-DD HH:MI:SS)
	item_review_images: ItemReviewImage[] | null; // รูปภาพรีวิว
}
