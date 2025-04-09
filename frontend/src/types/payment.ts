export interface PaymentType {
	id: string; // UUID, รหัสการชำระเงิน
	renter_id: string; // VARCHAR(10), รหัสการเช่า
	total_price: number; // NUMERIC, จำนวนเงิน
	status: string; // TEXT(100), สถานะการชำระ
	created_at: string; // TIMESTAMPTZ, วันที่สร้าง (format: YYYY-MM-DD HH:MI:SS)
	updated_at: string; // TIMESTAMPTZ, วันที่อัปเดต (format: YYYY-MM-DD HH:MI:SS)
}
