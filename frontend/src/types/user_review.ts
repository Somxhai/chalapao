export interface UserReviewType {
	id: string; // UUID, รหัสที่อยู่
	reviewer_id: string; // VARCHAR(10), รหัสผู้ใช้
	user_id: string; // VARCHAR(10), รหัสผู้ใช้
	comment: string; // TEXT, ความคิดเห็น
	rating: number; // INT(0-5), คะแนนรีวิว
	created_at: string; // TIMESTAMPTZ, วันที่สร้าง (format: YYYY-MM-DD HH:MI:SS)
	updated_at: string; // TIMESTAMPTZ, วันที่อัปเดต (format: YYYY-MM-DD HH:MI:SS)
}
