import { safeQuery } from "../../lib/utils.ts";
import { UUIDTypes } from "uuid";
import { Rental, RentalAddress } from "../../type/rental.ts";
import { createPayment } from "./payment.ts";

export type RentalInput = Omit<Rental, "delivery_address" | "return_address">;

export const createRental = async (
	rental: RentalInput,
	return_address: RentalAddress,
	delivery_address: RentalAddress
): Promise<Rental> => {
	return_address.type = "return";
	delivery_address.type = "delivery";

	const deliveryId = await createRentalAddress(delivery_address);
	const returnId = await createRentalAddress(return_address);

	if (!deliveryId || !returnId) {
		throw new Error("Failed to create rental address");
	}

	const payment = await createPayment(
		rental.renter_id,
		rental.item_id,
		"pending",
		rental.start_date,
		rental.end_date
	);

	if (!payment || !payment.id) {
		throw new Error("Failed to create payment");
	}

	const rentalRes = await safeQuery(
		async (client) =>
			await client.query<Rental>(
				`INSERT INTO rental (
          renter_id, item_id,
          status, start_date, end_date,
          delivery_address, return_address, payment_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;`,
				[
					rental.renter_id,
					rental.item_id,
					rental.status,
					rental.start_date,
					rental.end_date,
					deliveryId,
					returnId,
					payment.id,
				]
			),
		`Failed to create rental by ${rental.renter_id} for item: ${rental.item_id}`
	).then((res) => res.rows[0]);

	return rentalRes;
};

// Return rows affected
export const updateRentalStatus = async (
	rentalId: UUIDTypes,
	status: string
): Promise<Rental> =>
	await safeQuery(
		(client) =>
			client.query(
				`UPDATE "rental"
         SET status = $1
         WHERE id = $2 RETURNING *;`,
				[status, rentalId]
			),
		`Failed to update rental status for: ${rentalId}`
	).then((res) => res.rows[0]);

export const deleteRental = async (rentalId: UUIDTypes): Promise<UUIDTypes> =>
	await safeQuery(
		(client) =>
			client.query<{ id: UUIDTypes }>(
				`DELETE FROM "rental"
         WHERE id = $1
         RETURNING id;`,
				[rentalId]
			),
		`Failed to delete rental: ${rentalId}`
	).then((res) => res.rows[0]?.id);

export const createRentalAddress = async (
	address: RentalAddress
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
				]
			),
		`Failed to create rental address`
	).then((res) => res.rows[0]?.id);

export const getRentalById = async (rentalId: UUIDTypes): Promise<Rental> =>
	await safeQuery(
		(client) =>
			client.query<Rental>(
				`
    SELECT
      r.*,
      jsonb_build_object(
      'id', renter.id,
      'first_name', renter.first_name,
      'last_name', renter.last_name,
      'gender', renter.gender,
      'birth_date', renter.birth_date,
      'citizen_id', renter.citizen_id,
      'phone_number', renter.phone_number,
      'created_at', renter.created_at,
      'updated_at', renter.updated_at
      ) AS renter_info,
      jsonb_build_object(
      'id', lessor.id,
      'first_name', lessor.first_name,
      'last_name', lessor.last_name,
      'gender', lessor.gender,
      'birth_date', lessor.birth_date,
      'citizen_id', lessor.citizen_id,
      'phone_number', lessor.phone_number,
      'created_at', lessor.created_at,
      'updated_at', lessor.updated_at
      ) AS lessor_info,
      jsonb_build_object(
      'id', i.id,
      'item_name', i.item_name,
      'description', i.description,
      'price_per_day', i.price_per_day,
      'images', COALESCE(
        array_agg(DISTINCT ii.path) FILTER (WHERE ii.path IS NOT NULL),
        '{}'
      )
      ) AS item,
      jsonb_build_object(
      'id', da.id,
      'residence_info', da.residence_info,
      'sub_district', da.sub_district,
      'district', da.district,
      'province', da.province,
      'postal_code', da.postal_code
      ) AS delivery_address_info,
      jsonb_build_object(
      'id', ra.id,
      'residence_info', ra.residence_info,
      'sub_district', ra.sub_district,
      'district', ra.district,
      'province', ra.province,
      'postal_code', ra.postal_code
      ) AS return_address_info,
      jsonb_build_object(
      'id', p.id,
      'status', p.status,
      'total_price', p.total_price,
      'created_at', p.created_at,
      'updated_at', p.updated_at
      ) AS payment
    FROM rental r
    LEFT JOIN item i ON r.item_id = i.id
    LEFT JOIN item_image ii ON i.id = ii.item_id
    LEFT JOIN user_info renter ON r.renter_id = renter.user_id
    LEFT JOIN user_info lessor ON i.owner_id = lessor.user_id
    LEFT JOIN rental_address da ON r.delivery_address = da.id
    LEFT JOIN rental_address ra ON r.return_address = ra.id
    LEFT JOIN payment p ON p.renter_id = r.renter_id
    WHERE r.id = $1
    GROUP BY
      r.id, renter.id, lessor.id, i.id,
      da.id, ra.id, p.id
    ORDER BY r.id
    `,
				[rentalId]
			),
		`Failed to get rental by id: ${rentalId}`
	).then((res) => res.rows[0]);

export const getRentalsByUserId = async (
	userId: UUIDTypes
): Promise<Rental[]> =>
	await safeQuery(
		(client) =>
			client.query<Rental>(
				`
    SELECT
  r.*,
  jsonb_build_object(
    'id', renter.id,
    'first_name', renter.first_name,
    'last_name', renter.last_name,
    'gender', renter.gender,
    'birth_date', renter.birth_date,
    'citizen_id', renter.citizen_id,
    'phone_number', renter.phone_number,
    'created_at', renter.created_at,
    'updated_at', renter.updated_at
  ) AS renter_info,
  jsonb_build_object(
    'id', lessor.id,
    'first_name', lessor.first_name,
    'last_name', lessor.last_name,
    'gender', lessor.gender,
    'birth_date', lessor.birth_date,
    'citizen_id', lessor.citizen_id,
    'phone_number', lessor.phone_number,
    'created_at', lessor.created_at,
    'updated_at', lessor.updated_at
  ) AS lessor_info,
  jsonb_build_object(
    'id', i.id,
    'item_name', i.item_name,
    'description', i.description,
    'price_per_day', i.price_per_day,
    'images', COALESCE(ii.images, '{}')
  ) AS item,
  jsonb_build_object(
    'id', da.id,
    'residence_info', da.residence_info,
    'sub_district', da.sub_district,
    'district', da.district,
    'province', da.province,
    'postal_code', da.postal_code
  ) AS delivery_address_info,
  jsonb_build_object(
    'id', ra.id,
    'residence_info', ra.residence_info,
    'sub_district', ra.sub_district,
    'district', ra.district,
    'province', ra.province,
    'postal_code', ra.postal_code
  ) AS return_address_info,
  jsonb_build_object(
    'id', p.id,
    'status', p.status,
    'total_price', p.total_price,
    'created_at', p.created_at,
    'updated_at', p.updated_at
  ) AS payment
FROM rental r
LEFT JOIN item i ON r.item_id = i.id

-- 👇 Aggregate รูป item_image ก่อน
LEFT JOIN (
  SELECT item_id, array_agg(path) AS images
  FROM item_image
  GROUP BY item_id
) ii ON ii.item_id = i.id

LEFT JOIN user_info renter ON r.renter_id = renter.user_id
LEFT JOIN user_info lessor ON i.owner_id = lessor.user_id
LEFT JOIN rental_address da ON r.delivery_address = da.id
LEFT JOIN rental_address ra ON r.return_address = ra.id
LEFT JOIN payment p ON p.id = r.payment_id

WHERE r.renter_id = $1
ORDER BY r.id;

    `,
				[userId]
			),
		`Failed to get rentals for user: ${userId}`
	).then((res) => res.rows);

export const getRentalsByLessorUserId = async (
	userId: UUIDTypes
): Promise<Rental[]> =>
	await safeQuery(
		(client) =>
			client.query<Rental>(
				`
  SELECT
  r.*,
  jsonb_build_object(
  'id', renter.id,
  'first_name', renter.first_name,
  'last_name', renter.last_name,
  'gender', renter.gender,
  'birth_date', renter.birth_date,
  'citizen_id', renter.citizen_id,
  'phone_number', renter.phone_number,
  'created_at', renter.created_at,
  'updated_at', renter.updated_at
  ) AS renter_info,
  jsonb_build_object(
  'id', lessor.id,
  'first_name', lessor.first_name,
  'last_name', lessor.last_name,
  'gender', lessor.gender,
  'birth_date', lessor.birth_date,
  'citizen_id', lessor.citizen_id,
  'phone_number', lessor.phone_number,
  'created_at', lessor.created_at,
  'updated_at', lessor.updated_at
  ) AS lessor_info,
  jsonb_build_object(
  'id', i.id,
  'item_name', i.item_name,
  'description', i.description,
  'price_per_day', i.price_per_day,
  'images', COALESCE(
  array_agg(DISTINCT ii.path) FILTER (WHERE ii.path IS NOT NULL),
  '{}'
  )
  ) AS item,
  jsonb_build_object(
  'id', da.id,
  'residence_info', da.residence_info,
  'sub_district', da.sub_district,
  'district', da.district,
  'province', da.province,
  'postal_code', da.postal_code
  ) AS delivery_address_info,
  jsonb_build_object(
  'id', ra.id,
  'residence_info', ra.residence_info,
  'sub_district', ra.sub_district,
  'district', ra.district,
  'province', ra.province,
  'postal_code', ra.postal_code
  ) AS return_address_info,
  jsonb_build_object(
  'id', p.id,
  'status', p.status,
  'total_price', p.total_price,
  'created_at', p.created_at,
  'updated_at', p.updated_at
  ) AS payment
  FROM rental r
  LEFT JOIN item i ON r.item_id = i.id
  LEFT JOIN item_image ii ON i.id = ii.item_id
  LEFT JOIN user_info renter ON r.renter_id = renter.user_id
  LEFT JOIN user_info lessor ON i.owner_id = lessor.user_id
  LEFT JOIN rental_address da ON r.delivery_address = da.id
  LEFT JOIN rental_address ra ON r.return_address = ra.id
  LEFT JOIN payment p ON p.id = r.payment_id
  WHERE lessor.user_id = $1
  GROUP BY
  r.id, renter.id, lessor.id, i.id,
  da.id, ra.id, p.id
  ORDER BY r.id
  `,
				[userId]
			),
		`Failed to get rentals for lessor user: ${userId}`
	).then((res) => res.rows);
