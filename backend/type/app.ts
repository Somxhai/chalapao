import { UUIDTypes } from "uuid";

// Item Interface
export interface Item {
  id?: UUIDTypes;
  owner_id: string;
  item_name: string;
  description?: string;
  rental_terms: string;
  penalty_terms: string;
  item_status: "available" | "rented" | "unavailable";
  price_per_day: number;
  category_id?: UUIDTypes;
  created_at?: string;
  updated_at?: string;
}

// Rental Interface
export interface Rental {
  id: UUIDTypes;
  renter_id: string;
  item_id: UUIDTypes;
  delivery_address: UUIDTypes;
  return_address: UUIDTypes;
  payment_id: UUIDTypes;
  status: "pending" | "accepted" | "cancel";
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

// Rental Address Interface
export interface RentalAddress {
  id: UUIDTypes;
  rental_id: UUIDTypes;
  type: "delivery" | "return";
  residence_info: string;
  sub_district: string;
  district: string;
  province: string;
  postal_code: string;
  created_at: string;
  updated_at: string;
}

// Category Interface
export interface Category {
  id?: UUIDTypes;
  name: string;
  created_at?: string;
  updated_at?: string | null;
}

// Review User Interface
export interface ReviewUser {
  id: UUIDTypes;
  reviewer_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

// Review Item Interface
export interface ReviewItem {
  id: UUIDTypes;
  reviewer_id: string;
  item_id: UUIDTypes;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

// Review Image Interface
export interface ReviewImage {
  id: UUIDTypes;
  image_url: string;
}

// Keyword Interface
export interface Keyword {
  id: UUIDTypes;
  item_id: UUIDTypes;
  keyword: string;
}

// Item Image Interface
export interface ItemImage {
  id: UUIDTypes;
  item_id: UUIDTypes;
  image_url: string;
}

// Payment Interface
export interface Payment {
  id: UUIDTypes;
  renter_id: string;
  status: "pending" | "completed" | "failed";
  total_price: number;
  created_at: string;
  updated_at: string;
}

// User Info Interface
export interface UserInfo {
  id: UUIDTypes;
  first_name: string;
  last_name: string;
  gender: string;
  birth_date: string;
  citizen_id: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
}
