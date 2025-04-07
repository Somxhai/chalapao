export type Address = {
	id: string; // UUID, รหัสที่อยู่
	user_id: string; // VARCHAR, รหัสผู้ใช้
	is_primary: boolean; // BOOLEAN, เป็นที่อยู่หลัก
	residence_info: string; // TEXT, ข้อมูลที่อยู่
	subdistrict: string; // VARCHAR, ตำบล
	district: string; // VARCHAR, อำเภอ
	province: string; // VARCHAR, จังหวัด
	postal_code: string; // VARCHAR, รหัสไปรษณีย์
	created_at: string; // TIMESTAMPTZ, วันที่สร้าง (format: YYYY-MM-DD HH:MI:SS)
	updated_at: string; // TIMESTAMPTZ, วันที่อัปเดต (format: YYYY-MM-DD HH:MI:SS)
};
