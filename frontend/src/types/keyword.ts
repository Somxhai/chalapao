export interface KeywordType {
	id: string; // UUID, รหัสคีย์เวิร์ด, Example: 550e8400-e29b-41d4-a716-446655440000
	item_id: string; // UUID, รหัสสินค้า, Example: 550e8400-e29b-41d4-a716-446655440000
	keyword: string; // TEXT, คีย์เวิร์ด, Example: Juad
	created_at: string; // TIMESTAMPTZ, วันที่สร้าง, Format: YYYY-MM-DD HH:MI:SS, Example: 2024-03-22 22:17:30
	updated_at: string; // TIMESTAMPTZ, วันที่อัปเดต, Format: YYYY-MM-DD HH:MI:SS, Example: 2024-03-22 22:19:00
}
