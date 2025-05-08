import { AddressType } from "./address";
import { UserReviewType } from "./user_review";

export type UserType = {
	user_id: string; // UUID, รหัสข้อมูลผู้ใช้
	user_type: string; // TEXT, ประเภทผู้ใช้
	user_name: string; // VARCHAR, ชื่อผู้ใช้
	email: string; // VARCHAR, email ผู้ใช้
	image_url: string; // VARCHAR, url รูปภาพ
	citizen_id: string; // VARCHAR, เลขบัตรประชาชน
	first_name: string; // TEXT, ชื่อ
	last_name: string; // TEXT, นามสกุล
	gender: string; // VARCHAR, เพศ
	birth: string; // DATE, วันเดือนปีเกิด (format: YYYY-MM-DD)
	phone_number: string; // VARCHAR, เบอร์โทรศัพท์
	created_at: string; // TIMESTAMPTZ, วันที่สร้าง (format: YYYY-MM-DD HH:MI:SS)
	updated_at: string; // TIMESTAMPTZ, วันที่อัปเดต (format: YYYY-MM-DD HH:MI:SS)
	address: AddressType; // TEXT, ที่อยู่
	user_reviews: UserReviewType[]; // TEXT, รีวิวผู้ใช้
	user_rating: number; // FLOAT(0-5), คะแนนเฉลี่ยของผู้ใช้
};
