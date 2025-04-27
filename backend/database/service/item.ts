import { UUIDTypes } from "uuid";
import { FullItem, Item } from "../../type/app.ts";
import { safeQuery } from "../../lib/utils.ts";

export const getItems = async (offset = 0, limit = 30): Promise<FullItem[]> =>
	await safeQuery(
		(client) =>
			client.query<FullItem>(
				`
SELECT
  i.*,
  COALESCE(array_agg(DISTINCT ii.path) FILTER (WHERE ii.path IS NOT NULL), '{}') AS images,
  COALESCE(array_agg(DISTINCT k.keyword) FILTER (WHERE k.keyword IS NOT NULL), '{}') AS keywords,
  c.name AS category_name,
  jsonb_build_object(
    'id', u.id,
    'first_name', u.first_name,
    'last_name', u.last_name,
    'gender', u.gender,
    'birth_date', u.birth_date,
    'citizen_id', u.citizen_id,
    'phone_number', u.phone_number,
    'created_at', u.created_at,
    'updated_at', u.updated_at,
    'addresses', COALESCE(
      jsonb_agg(
        DISTINCT jsonb_build_object(
          'id', a.id,
          'user_id', a.user_id,
          'is_primary', a.is_primary,
          'residence_info', a.residence_info,
          'sub_district', a.sub_district,
          'district', a.district,
          'province', a.province,
          'postal_code', a.postal_code,
          'created_at', a.created_at,
          'updated_at', a.updated_at
        )
      ) FILTER (WHERE a.id IS NOT NULL),
      '[]'
    )
  ) AS user_info
FROM "item" i
LEFT JOIN item_image ii ON i.id = ii.item_id
LEFT JOIN keyword k ON i.id = k.item_id
LEFT JOIN category c ON i.category_id = c.id
LEFT JOIN user_info u ON i.owner_id = u.user_id
LEFT JOIN address a ON u.user_id = a.user_id
GROUP BY i.id, c.name, u.id, u.first_name, u.last_name, u.gender, u.birth_date, u.citizen_id, u.phone_number, u.created_at, u.updated_at
LIMIT $1 OFFSET $2;
`,
				[limit, offset]
			),
		`Failed to get items: offset = ${offset}, limit = ${limit}`
	).then((res) => res.rows);

export const getItemsByCategory = async (
	id: UUIDTypes,
	offset = 0,
	limit = 30
): Promise<FullItem[]> =>
	await safeQuery(
		(client) =>
			client.query<FullItem>(
				`SELECT
  i.*,
  COALESCE(array_agg(DISTINCT ii.path) FILTER (WHERE ii.path IS NOT NULL), '{}') AS images,
  COALESCE(array_agg(DISTINCT k.keyword) FILTER (WHERE k.keyword IS NOT NULL), '{}') AS keywords,
  c.name AS category_name,
  jsonb_build_object(
    'id', u.id,
    'first_name', u.first_name,
    'last_name', u.last_name,
    'gender', u.gender,
    'birth_date', u.birth_date,
    'citizen_id', u.citizen_id,
    'phone_number', u.phone_number,
    'created_at', u.created_at,
    'updated_at', u.updated_at,
    'addresses', COALESCE(
      jsonb_agg(
        DISTINCT jsonb_build_object(
          'id', a.id,
          'user_id', a.user_id,
          'is_primary', a.is_primary,
          'residence_info', a.residence_info,
          'sub_district', a.sub_district,
          'district', a.district,
          'province', a.province,
          'postal_code', a.postal_code,
          'created_at', a.created_at,
          'updated_at', a.updated_at
        )
      ) FILTER (WHERE a.id IS NOT NULL),
      '[]'
    )
  ) AS user_info
FROM "item" i
LEFT JOIN item_image ii ON i.id = ii.item_id
LEFT JOIN keyword k ON i.id = k.item_id
LEFT JOIN category c ON i.category_id = c.id
LEFT JOIN user_info u ON i.owner_id = u.user_id
LEFT JOIN address a ON u.user_id = a.user_id
WHERE i.category_id = $1
GROUP BY i.id, c.name, u.id, u.first_name, u.last_name, u.gender, u.birth_date, u.citizen_id, u.phone_number, u.created_at, u.updated_at
LIMIT $2 OFFSET $3`,
				[id, limit, offset]
			),
		`Failed to get items by category: ${id}`
	).then((res) => res.rows);

export const getItemsByUserId = async (id: string): Promise<FullItem[]> =>
	await safeQuery(
		(client) =>
			client.query<FullItem>(
				`SELECT
  i.*,
  COALESCE(array_agg(DISTINCT ii.path) FILTER (WHERE ii.path IS NOT NULL), '{}') AS images,
  COALESCE(array_agg(DISTINCT k.keyword) FILTER (WHERE k.keyword IS NOT NULL), '{}') AS keywords,
  c.name AS category_name,
  jsonb_build_object(
    'id', u.id,
    'first_name', u.first_name,
    'last_name', u.last_name,
    'gender', u.gender,
    'birth_date', u.birth_date,
    'citizen_id', u.citizen_id,
    'phone_number', u.phone_number,
    'created_at', u.created_at,
    'updated_at', u.updated_at,
    'addresses', COALESCE(
      jsonb_agg(
        DISTINCT jsonb_build_object(
          'id', a.id,
          'user_id', a.user_id,
          'is_primary', a.is_primary,
          'residence_info', a.residence_info,
          'sub_district', a.sub_district,
          'district', a.district,
          'province', a.province,
          'postal_code', a.postal_code,
          'created_at', a.created_at,
          'updated_at', a.updated_at
        )
      ) FILTER (WHERE a.id IS NOT NULL),
      '[]'
    )
  ) AS user_info
FROM "item" i
LEFT JOIN item_image ii ON i.id = ii.item_id
LEFT JOIN keyword k ON i.id = k.item_id
LEFT JOIN category c ON i.category_id = c.id
LEFT JOIN user_info u ON i.owner_id = u.user_id
LEFT JOIN address a ON u.user_id = a.user_id
WHERE i.owner_id = $1
GROUP BY i.id, c.name, u.id, u.first_name, u.last_name, u.gender, u.birth_date, u.citizen_id, u.phone_number, u.created_at, u.updated_at;`,
				[id]
			),
		`Failed to get items by user ID: ${id}`
	).then((res) => res.rows);

export const getItemById = async (id: UUIDTypes): Promise<FullItem> =>
	await safeQuery(
		(client) =>
			client.query<FullItem>(
				`SELECT
  i.*,
  COALESCE(array_agg(DISTINCT ii.path) FILTER (WHERE ii.path IS NOT NULL), '{}') AS images,
  COALESCE(array_agg(DISTINCT k.keyword) FILTER (WHERE k.keyword IS NOT NULL), '{}') AS keywords,
  c.name AS category_name,
  jsonb_build_object(
    'id', u.id,
    'first_name', u.first_name,
    'last_name', u.last_name,
    'gender', u.gender,
    'birth_date', u.birth_date,
    'citizen_id', u.citizen_id,
    'phone_number', u.phone_number,
    'created_at', u.created_at,
    'updated_at', u.updated_at,
    'addresses', COALESCE(
      jsonb_agg(
        DISTINCT jsonb_build_object(
          'id', a.id,
          'user_id', a.user_id,
          'is_primary', a.is_primary,
          'residence_info', a.residence_info,
          'sub_district', a.sub_district,
          'district', a.district,
          'province', a.province,
          'postal_code', a.postal_code,
          'created_at', a.created_at,
          'updated_at', a.updated_at
        )
      ) FILTER (WHERE a.id IS NOT NULL),
      '[]'
    )
  ) AS user_info
FROM "item" i
LEFT JOIN item_image ii ON i.id = ii.item_id
LEFT JOIN keyword k ON i.id = k.item_id
LEFT JOIN category c ON i.category_id = c.id
LEFT JOIN user_info u ON i.owner_id = u.user_id
LEFT JOIN address a ON u.user_id = a.user_id
WHERE i.id = $1
GROUP BY i.id, c.name, u.id, u.first_name, u.last_name, u.gender, u.birth_date, u.citizen_id, u.phone_number, u.created_at, u.updated_at;`,
				[id]
			),
		`Failed to get item by ID: ${id}`
	).then((res) => res.rows[0]);

export const createItem = async (
	item: Item,
	owner_id: UUIDTypes
): Promise<FullItem> =>
	await safeQuery(
		(client) =>
			client.query<FullItem>(
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
): Promise<FullItem> =>
	await safeQuery(
		(client) =>
			client.query<FullItem>(
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
