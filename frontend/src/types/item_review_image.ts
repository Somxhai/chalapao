export interface ItemReviewImageType {
	id: string; // UUID, รหัสรีวิว
	item_review_id: string; // UUID, รหัสรีวิว
	image_url: string; // VARCHAR(1000), url รูปภาพ
	created_at: string; // TIMESTAMPTZ, วันที่สร้าง (format: YYYY-MM-DD HH:MI:SS)
	updated_at: string; // TIMESTAMPTZ, วันที่อัปเดต (format: YYYY-MM-DD HH:MI:SS)
}
