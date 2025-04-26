import { safeQuery } from "../../lib/utils.ts";
import { UUIDTypes } from "uuid";
import { Rental, RentalAddress } from "../../type/rental.ts";
import { createPayment } from "./payment.ts";

export type RentalInput = Omit<Rental, "delivery_address" | "return_address">;

export const createRental = async (
  rental: RentalInput,
  return_address: RentalAddress,
  delivery_address: RentalAddress,
): Promise<Rental> => {
  return_address.type = "return";
  delivery_address.type = "delivery";

  const deliveryId = await createRentalAddress(delivery_address);
  const returnId = await createRentalAddress(return_address);

  if (!deliveryId || !returnId) {
    throw new Error("Failed to create rental address");
  }

  const rentalRes = await safeQuery(
    async (client) =>
      // Insert rental with the address IDs
      await client.query<Rental>(
        `INSERT INTO rental (
         renter_id, item_id,
         status, start_date, end_date,
         delivery_address, return_address
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *;`,
        [
          rental.renter_id,
          rental.item_id,
          rental.status,
          rental.start_date,
          rental.end_date,
          deliveryId,
          returnId,
        ],
      ),
    `Failed to create rental by ${rental.renter_id} for item: ${rental.item_id}`,
  )
    .then((res) => res.rows[0]);

  const payment = await createPayment(
    rentalRes.renter_id,
    rental.item_id,
    "pending",
    rental.start_date,
    rental.end_date,
  );

  if (!payment) {
    throw new Error("Failed to create payment");
  }
  return rentalRes;
};

// Return rows affected
export const updateRentalStatus = async (
  rentalId: UUIDTypes,
  status: string,
): Promise<Rental> =>
  await safeQuery(
    (client) =>
      client.query(
        `UPDATE "rental"
         SET status = $1
         WHERE id = $2 RETURNING *;`,
        [status, rentalId],
      ),
    `Failed to update rental status for: ${rentalId}`,
  ).then((res) => res.rows[0]);

export const deleteRental = async (
  rentalId: UUIDTypes,
): Promise<UUIDTypes> =>
  await safeQuery(
    (client) =>
      client.query<{ id: UUIDTypes }>(
        `DELETE FROM "rental"
         WHERE id = $1
         RETURNING id;`,
        [rentalId],
      ),
    `Failed to delete rental: ${rentalId}`,
  ).then((res) => res.rows[0]?.id);

export const createRentalAddress = async (
  address: RentalAddress,
): Promise<UUIDTypes> =>
  await safeQuery(
    (client) =>
      client.query<{ id: UUIDTypes }>(
        `INSERT INTO rental_address (
         residence_info, sub_district, district,
         province, postal_code
       )
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id;`,
        [
          address.residence_info,
          address.sub_district,
          address.district,
          address.province,
          address.postal_code,
        ],
      ),
    `Failed to create rental address`,
  ).then((res) => res.rows[0]?.id);
