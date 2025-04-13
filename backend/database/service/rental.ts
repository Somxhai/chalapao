import { safeQuery } from "../../lib/utils.ts";
import { UUIDTypes } from "uuid";

export const createRental = async (
  renterId: UUIDTypes,
  itemId: UUIDTypes,
  deliveryAddress: string,
  paymentId: UUIDTypes,
  status: string,
  startDate: string,
  endDate: string,
): Promise<string> =>
  await safeQuery(
    (client) =>
      client.query<{ id: string }>(
        `INSERT INTO "rental" (
           renter_id, item_id, delivery_address, payment_id,
           status, start_date, end_date
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id;`,
        [
          renterId,
          itemId,
          deliveryAddress,
          paymentId,
          status,
          startDate,
          endDate,
        ],
      ),
    `Failed to create rental for item: ${itemId}`,
  ).then((res) => res.rows[0].id);

export const updateRentalStatus = async (
  rentalId: UUIDTypes,
  status: string,
): Promise<number> =>
  await safeQuery(
    (client) =>
      client.query(
        `UPDATE "rental"
         SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2;`,
        [status, rentalId],
      ),
    `Failed to update rental status for: ${rentalId}`,
  ).then((res) => res.rowCount ?? 0);

export const deleteRental = async (
  rentalId: UUIDTypes,
): Promise<UUIDTypes> =>
  await safeQuery(
    (client) =>
      client.query<{ id: string }>(
        `DELETE FROM "rental"
         WHERE id = $1 AND status = 'canceled'
         RETURNING id;`,
        [rentalId],
      ),
    `Failed to delete rental: ${rentalId}`,
  ).then((res) => res.rows[0]?.id ?? null);
