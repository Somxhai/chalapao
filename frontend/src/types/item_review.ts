export interface ItemReviewType {
	id: string; // UUID, รหัสรีวิว
	reviewer_id: string; // VARCHAR(10), รหัสผู้ใช้
	item_id: string; // UUID, รหัสสินค้า
	rating: number; // INT(0-5), คะแนนรีวิว
	comment: string; // TEXT, ความคิดเห็น
	created_at: string; // TIMESTAMPTZ, วันที่สร้าง (format: YYYY-MM-DD HH:MI:SS)
	updated_at: string; // TIMESTAMPTZ, วันที่อัปเดต (format: YYYY-MM-DD HH:MI:SS)
	images: string[]; // รูปภาพรีวิว
}
