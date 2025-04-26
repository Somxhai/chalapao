import { UUIDTypes } from "uuid";
import { Item } from "../../type/app.ts";
import { safeQuery } from "../../lib/utils.ts";

export const getItems = async (offset = 0, limit = 30): Promise<Item[]> =>
	await safeQuery(
		(client) =>
			client.query<Item>(`SELECT * FROM "item" LIMIT $1 OFFSET $2;`, [
				limit,
				offset,
			]),
		`Failed to get items: offset = ${offset}, limit = ${limit}`
	).then((res) => res.rows);

export const getItemsByCategory = async (
	id: UUIDTypes,
	offset = 0,
	limit = 30
): Promise<Item[]> =>
	await safeQuery(
		(client) =>
			client.query<Item>(
				`SELECT * FROM "item" WHERE category_id = $1 LIMIT $2 OFFSET $3;`,
				[id, limit, offset]
			),
		`Failed to get items by category: ${id}`
	).then((res) => res.rows);

export const getItemsByUserId = async (id: string): Promise<Item[]> =>
	await safeQuery(
		(client) =>
			client.query<Item>(`SELECT * FROM "item" WHERE owner_id = $1;`, [
				id,
			]),
		`Failed to get items by user ID: ${id}`
	).then((res) => res.rows);

export const getItemById = async (id: UUIDTypes): Promise<Item> =>
	await safeQuery(
		(client) =>
			client.query<Item>(`SELECT * FROM "item" WHERE id = $1;`, [id]),
		`Failed to get item by ID: ${id}`
	).then((res) => res.rows[0]);

export const createItem = async (
	item: Item,
	owner_id: UUIDTypes
): Promise<Item> =>
	await safeQuery(
		(client) =>
			client.query<Item>(
				`
        INSERT INTO "item" (
          owner_id, item_name, description, rental_terms,
          penalty_terms, item_status, price_per_day, category_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `,
				[
					owner_id,
					item.item_name,
					item.description,
					item.rental_terms,
					item.penalty_terms,
					item.item_status,
					item.price_per_day,
					item.category_id,
				]
			),
		`Failed to create item: ${item.item_name}`
	).then((res) => res.rows[0]);

export const updateItem = async (
	item: Item,
	owner_id: UUIDTypes
): Promise<Item> =>
	await safeQuery(
		(client) =>
			client.query<Item>(
				`
        UPDATE "item"
        SET item_name = $1, description = $2, rental_terms = $3,
            penalty_terms = $4, item_status = $5, price_per_day = $6,
            category_id = $7
        WHERE id = $8 AND owner_id = $9
        RETURNING *;
      `,
				[
					item.item_name,
					item.description,
					item.rental_terms,
					item.penalty_terms,
					item.item_status,
					item.price_per_day,
					item.category_id,
					item.id,
					owner_id,
				]
			),
		`Failed to update item: ${item.id}`
	).then((res) => res.rows[0]);

export const deleteItemById = async (
	itemId: string,
	user_id: UUIDTypes
): Promise<UUIDTypes> =>
	await safeQuery(
		(client) =>
			client.query<{ id: string }>(
				`DELETE FROM "item" WHERE id = $1 AND owner_id = $2 RETURNING id;`,
				[itemId, user_id]
			),
		`Failed to delete item: ${itemId}`
	).then((res) => res.rows[0]?.id ?? null);

export const addImageToItem = async (
	itemId: string,
	imageUrl: string
): Promise<string> =>
	await safeQuery(
		(client) =>
			client.query<{ image_url: string }>(
				`INSERT INTO "item_image" (item_id, image_url) VALUES ($1, $2) RETURNING image_url;`,
				[itemId, imageUrl]
			),
		`Failed to add image to item: ${itemId}`
	).then((res) => res.rows[0].image_url);
