import { safeQuery } from "../../lib/utils.ts";
import { UUIDTypes } from "uuid";
import { CombinedRental, Rental, RentalAddress } from "../../type/rental.ts";
import { createPayment, getPaymentById } from "./payment.ts";
import { getItemById, getItemsByUserId } from "./item.ts";
import { getUserInfoByUserId, getUserInfoByUserIds } from "./user_info.ts";
import { Item, Payment } from "../../type/app.ts";
import { PoolClient } from "pg";

export type RentalInput = Omit<
	Rental,
	"delivery_address" | "return_address" | "payment_id"
>;

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

	if (!payment) {
		throw new Error("Failed to create payment");
	}

	const rentalRes = await safeQuery(
		async (client) =>
			// Insert rental with the address IDs
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

export const getRentalAddressById = async (
	id: UUIDTypes,
	client?: PoolClient
): Promise<RentalAddress> =>
	await safeQuery(
		(client) =>
			client.query(`SELECT * from "rental_address" WHERE id = $1`, [id]),
		`Failed to get rental address by id: ${id}`,
		client
	).then((res) => res.rows[0]);

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

export const getRentalById = async (
	rentalId: UUIDTypes
): Promise<CombinedRental> =>
	await safeQuery(async (client) => {
		const rental = await client
			.query<Rental>(`SELECT * FROM rental WHERE id = $1`, [rentalId])
			.then((res) => res.rows[0]);

		const item = await getItemById(rental.item_id, client);
		const renterUserInfo = await getUserInfoByUserId(
			rental.renter_id,
			client
		);

		const deliveryAddress = await getRentalAddressById(
			rental.delivery_address,
			client
		);
		const returnAddress = await getRentalAddressById(
			rental.return_address,
			client
		);

		const payment = await getPaymentById(rental.payment_id, client);
		return {
			rental,
			renter_info: renterUserInfo,
			lessor_info: item.owner_info,
			item: { ...item.item, images: item.images },
			delivery_address: deliveryAddress,
			return_address: returnAddress,
			payment,
		} as CombinedRental;
	}, `Failed to get rental by id: ${rentalId}`).then((res) => res);

export const getRentalsByUserId = async (
	userId: UUIDTypes
): Promise<CombinedRental[]> =>
	await safeQuery(async (client) => {
		const rentals = await client
			.query<{
				rental: Rental;
				rental_address: RentalAddress;
				delivery_address: RentalAddress;
				payment: Payment;
			}>(
				`SELECT
    row_to_json(rental) AS rental,
    row_to_json(ra) AS rental_address,
    row_to_json(da) AS delivery_address,
    row_to_json(p) AS payment
      FROM rental
      LEFT JOIN rental_address ra ON rental.return_address = ra.id
      LEFT JOIN rental_address da ON rental.delivery_address = da.id
      LEFT JOIN payment p ON p.id = rental.payment_id
      WHERE rental.renter_id = $1`,
				[userId]
			)
			.then((res) => res.rows);

		const itemIds = rentals.map((rental) => rental.rental.item_id);
		const items = await Promise.all(
			itemIds.map((itemId) => getItemById(itemId, client))
		);

		const renterUserInfo = await getUserInfoByUserId(userId, client);

		const lessorIds = items.map((item) => item.owner_info.user_id);
		const lessorUserInfo = await getUserInfoByUserIds(lessorIds, client);

		const fullRentals = rentals
			.map((rental) => {
				const item = items.find(
					(item) => item.item.id === rental.rental.item_id
				);
				const lessor_info = lessorUserInfo.find(
					(lessor) => lessor.user_id === item?.owner_info.user_id
				);

				if (!item) {
					return;
				}

				return {
					rental: rental.rental,
					return_address: rental.rental_address,
					delivery_address: rental.delivery_address,
					payment: rental.payment,
					item: { ...item.item, images: item.images },
					lessor_info,
					renter_info: renterUserInfo,
				} as CombinedRental;
			})
			.filter((data) => {
				return data !== undefined;
			});
		return fullRentals;
	}, `Failed to get rentals for user: ${userId}`).then((res) => res);

export const getRentalsAssociateWithItemOwner = async (
	owner_id: UUIDTypes
): Promise<CombinedRental[]> =>
	await safeQuery(async (client) => {
		const items = await getItemsByUserId(owner_id, client);

		const itemIds = items.map((item) => item.item.id);
		if (itemIds.length === 0) return [];

		const rentals = await client
			.query<Rental>(`SELECT * FROM rental WHERE item_id = ANY($1)`, [
				itemIds,
			])
			.then((res) => res.rows);

		const renterIds = [...new Set(rentals.map((r) => r.renter_id))];
		const paymentIds = rentals.map((r) => r.payment_id);
		const deliveryIds = rentals.map((r) => r.delivery_address);
		const returnIds = rentals.map((r) => r.return_address);

		const deliveryAddresses = await client
			.query<RentalAddress>(
				`SELECT * FROM rental_address WHERE id = ANY($1)`,
				[deliveryIds]
			)
			.then((res) => res.rows);

		const returnAddresses = await client
			.query<RentalAddress>(
				`SELECT * FROM rental_address WHERE id = ANY($1)`,
				[returnIds]
			)
			.then((res) => res.rows);

		const renterInfo = await getUserInfoByUserIds(renterIds, client);

		const payments = await client
			.query<Payment>(`SELECT * FROM payment WHERE id = ANY($1)`, [
				paymentIds,
			])
			.then((res) => res.rows);

		const lessorUserInfo = await getUserInfoByUserId(owner_id, client);

		return rentals.map((rental) => {
			const item = items.find((i) => i.item.id === rental.item_id)!;
			const payment = payments.find((p) => p.id === rental.payment_id)!;
			const renter_info = renterInfo.find(
				(u) => u.user_id === rental.renter_id
			)!;
			const delivery_address = deliveryAddresses.find(
				(a) => a.id === rental.delivery_address
			)!;
			const return_address = returnAddresses.find(
				(a) => a.id === rental.return_address
			)!;

			return {
				rental,
				item: { ...item.item, images: item.images },
				renter_info,
				lessor_info: lessorUserInfo,
				delivery_address,
				return_address,
				payment,
			} as CombinedRental;
		});
	}, `Failed to get rentals associated with item owner: ${owner_id}`).then(
		(res) => res
	);
