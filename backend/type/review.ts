import { UUIDTypes } from "uuid";

export type ReviewItem = {
  id: UUIDTypes;
  reviewer_id: UUIDTypes;
  item_id: UUIDTypes;
  rating: number;
  comment: string;
  created_at: Date; // ISO string (TIMESTAMPTZ)
  updated_at: Date;
};

export type ReviewUser = {
  id: UUIDTypes;
  reviewer_id: UUIDTypes;
  user_id: UUIDTypes;
  rating: number;
  comment: string;
  created_at: Date; // ISO string (TIMESTAMPTZ)
  updated_at: Date;
};
