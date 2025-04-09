export interface CategoryType {
	id: string; // UUID - รหัสหมวดหมู่
	name: string; // TEXT - ชื่อหมวดหมู่
	created_at: string; // TIMESTAMPTZ - วันที่สร้าง (format: YYYY-MM-DD HH:MI:SS)
	updated_at: string; // TIMESTAMPTZ - วันที่อัปเดต (format: YYYY-MM-DD HH:MI:SS)
}
