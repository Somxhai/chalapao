export interface RentalType {
	id: string; // UUID - รหัสการชำระเงิน
	renter_id: string; // VARCHAR(10) - รหัสการเช่า
	item_id: string; // UUID - รหัสผู้ใช้
	payment_id: string; // UUID - รหัสการชำระ
	status: string; // TEXT - สถานะการชำระ
	start_date: string; // DATE (YYYY-MM-DD) - วันที่เริ่มเช่า
	end_date: string; // DATE (YYYY-MM-DD) - วันที่สิ้นสุดการเช่า
	delivery_residence_info: string; // TEXT - ข้อมูลที่อยู่
	delivery_subdistrict: string; // VARCHAR(100) - ตำบล
	delivery_district: string; // VARCHAR(100) - อำเภอ
	delivery_province: string; // VARCHAR(100) - จังหวัด
	delivery_postal_code: string; // VARCHAR(5) - รหัสไปรษณีย์
	return_residence_info: string; // TEXT - ข้อมูลที่อยู่
	return_subdistrict: string; // VARCHAR(100) - ตำบล
	return_district: string; // VARCHAR(100) - อำเภอ
	return_province: string; // VARCHAR(100) - จังหวัด
	return_postal_code: string; // VARCHAR(5) - รหัสไปรษณีย์
	created_at: string; // TIMESTAMPTZ (YYYY-MM-DD HH:MI:SS) - วันที่สร้าง
	updated_at: string; // TIMESTAMPTZ (YYYY-MM-DD HH:MI:SS) - วันที่อัปเดต
}
