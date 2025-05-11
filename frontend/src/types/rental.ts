import { AddressType } from "./address";

export interface RentalType {
	id: string; // UUID - รหัสการชำระเงิน
	renter_id: string; // VARCHAR(10) - รหัสการเช่า
	item_id: string; // UUID - รหัสผู้ใช้
	payment_id: string; // UUID - รหัสการชำระ
	status: string; // TEXT - สถานะการชำระ
	start_date: string; // DATE (YYYY-MM-DD) - วันที่เริ่มเช่า
	end_date: string; // DATE (YYYY-MM-DD) - วันที่สิ้นสุดการเช่า
	delivery_address: AddressType; // AddressType - ที่อยู่ในการจัดส่ง
	return_address: AddressType; // AddressType - ที่อยู่ในการจัดส่ง
	created_at: string; // TIMESTAMPTZ (YYYY-MM-DD HH:MI:SS) - วันที่สร้าง
	updated_at: string; // TIMESTAMPTZ (YYYY-MM-DD HH:MI:SS) - วันที่อัปเดต
}
