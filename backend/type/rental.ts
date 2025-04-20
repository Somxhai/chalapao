import { UUIDTypes } from "uuid";

export type RentalStatus = "pending" | "accepted" | "cancel" | "completed";
// Rental Interface
export interface Rental {
  id?: UUIDTypes;
  renter_id: UUIDTypes;
  item_id: UUIDTypes;
  delivery_address: UUIDTypes;
  return_address: UUIDTypes;
  status: RentalStatus;
  start_date: Date;
  end_date: Date;
  created_at?: Date;
  updated_at?: Date;
}

// Rental Address Interface
export interface RentalAddress {
  id?: UUIDTypes;
  // rental_id: UUIDTypes;
  type: "delivery" | "return";
  residence_info: string;
  sub_district: string;
  district: string;
  province: string;
  postal_code: string;
  created_at?: Date;
  updated_at?: Date;
}
