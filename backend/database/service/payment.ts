import { UUIDTypes } from "uuid";
import { calculateTotalPrice, safeQuery } from "../../lib/utils.ts";
import { Payment } from "../../type/app.ts";
import { getItemById } from "./item.ts";
import { PoolClient } from "pg";

export const createPayment = async (
  renter_id: UUIDTypes,
  item_id: UUIDTypes,
  status: string = "pending",
  start_date: Date,
  end_date: Date,
): Promise<Payment> => {
  const item = await getItemById(item_id);

  return await safeQuery((client) => {
    start_date = new Date(start_date);
    end_date = new Date(end_date);

    const total_price = calculateTotalPrice(
      item.item.price_per_day,
      start_date,
      end_date,
    );

    return client.query<Payment>(
      `INSERT INTO payment (
          renter_id, status, total_price
         ) VALUES ($1, $2, $3)
         RETURNING *;`,
      [renter_id, status, total_price],
    );
  }, `Failed to create payment for renter: ${renter_id}`).then(
    (res) => res.rows[0],
  );
};

export const updatePaymentStatus = async (
  paymentId: UUIDTypes,
  status: "pending" | "completed" | "canceled" | "failed",
): Promise<Payment> =>
  await safeQuery(
    (client) =>
      client.query<Payment>(
        `UPDATE payment
             SET status = '$1'
             WHERE id = $2
             RETURNING *;`,
        [status, paymentId],
      ),
    `Failed to update payment status: ${paymentId}`,
  ).then((res) => res.rows[0]);

export const getPaymentById = async (
  paymentId: UUIDTypes,
  client?: PoolClient,
): Promise<Payment> =>
  await safeQuery(
    (client) =>
      client.query(`SELECT * FROM payment WHERE id = $1;`, [paymentId]),
    `Failed to get payment: ${paymentId}`,
    client,
  ).then((res) => res.rows[0]);
