import { UUIDTypes } from "uuid";
import { Item, Payment } from "./app.ts";
import { Address, UserInfo } from "./user_info.ts";

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
  payment_id: UUIDTypes;
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

export interface CombinedRental {
  rental: Rental;
  return_address: RentalAddress;
  delivery_address: RentalAddress;
  payment: Payment;
  item: Item;
  renter_info: UserInfo & { address: Address };
  lessor_info: UserInfo & { address: Address };
}
