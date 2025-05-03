import { UUIDTypes } from "uuid";
import { FullItem, Item, Keyword } from "../../type/app.ts";
import { safeQuery } from "../../lib/utils.ts";
import { getUserInfoByUserId } from "./user_info.ts";
import { Address, UserInfo } from "../../type/user_info.ts";
import { PoolClient } from "pg";

export const getItemsByUserId = async (
  id: UUIDTypes,
): Promise<FullItem[]> =>
  await safeQuery(
    async (client) => {
      const items = await client.query<Item>(
        `SELECT * FROM item WHERE owner_id = $1 ORDER BY created_at DESC`,
        [id],
      ).then((res) => res.rows);

      const itemIds = items.map((item) => item.id);
      const ownerIds = items.map((item) => item.owner_id);

      const images = await client.query<{ item_id: UUIDTypes; path: string }>(
        `SELECT item_id, path FROM item_image WHERE item_id = ANY($1)`,
        [itemIds],
      ).then((res) => res.rows);

      const keywords = await client.query<Keyword>(
        `SELECT * FROM keyword WHERE item_id = ANY($1)`,
        [itemIds],
      ).then((res) => res.rows);

      const addresses = await client.query<Address>(
        `SELECT * FROM address WHERE user_id = ANY($1)`,
        [ownerIds],
      ).then((res) => res.rows);

      const userInfo = await client.query<UserInfo>(
        `SELECT * FROM user_info WHERE user_id = ANY($1)`,
        [ownerIds],
      ).then((res) => res.rows);

      const categoryIds = [...new Set(items.map((item) => item.category_id))]
        .filter(
          (id): id is UUIDTypes => id !== null,
        );

      const categoryNames = await client.query<{ id: UUIDTypes; name: string }>(
        `SELECT id, name FROM category WHERE id = ANY($1)`,
        [categoryIds],
      ).then((res) => res.rows);

      return items.map((item) => {
        const itemImages = images.filter((img) => img.item_id === item.id);
        const itemKeywords = keywords.filter((k) => k.item_id === item.id).map((
          k,
        ) => k.keyword);
        const owner = userInfo.find((u) => u.user_id === item.owner_id);
        const address = addresses.find((a) => a.user_id === item.owner_id);
        const category = categoryNames.find((c) => c.id === item.category_id)
          ?.name;

        if (!owner) return;

        return {
          item,
          images: itemImages.map((img) => img.path),
          keywords: itemKeywords,
          owner_info: { ...owner, address: address },
          category,
        } as FullItem;
      }).filter((x) => x !== undefined);
    },
    `Failed to get items by user ID: ${id}`,
  ).then((res) => res);

export const getItems = async (
  offset = 0,
  limit = 30,
): Promise<FullItem[]> =>
  await safeQuery(
    async (client) => {
      const items = await client.query<Item>(
        `SELECT * FROM item ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset],
      ).then((res) => res.rows);

      const itemIds = items.map((item) => item.id);
      const images = await client.query<{ item_id: UUIDTypes; path: string }>(
        `SELECT item_id, path FROM item_image WHERE item_id = ANY($1)`,
        [itemIds],
      ).then((res) => res.rows);

      const categoryIds = Array.from(
        new Set(
          items.map((item) => item.category_id).filter((id): id is UUIDTypes =>
            id !== null
          ),
        ),
      );

      const categoryNames = await client.query<{ id: UUIDTypes; name: string }>(
        `SELECT id, name FROM category WHERE id = ANY($1)`,
        [categoryIds],
      ).then((res) => res.rows);

      const ownerIds = items.map((item) => item.owner_id);

      const lessorUserInfo = await client.query<UserInfo>(
        `SELECT * FROM user_info WHERE user_id = ANY($1)`,
        [ownerIds],
      ).then((res) => res.rows);

      const keywords = await client.query<
        Keyword
      >(
        `SELECT * FROM keyword WHERE item_id = ANY($1)`,
        [itemIds],
      ).then((res) => res.rows);

      const addresses = await client.query<Address>(
        `SELECT * FROM address WHERE user_id = ANY($1)`,
        [ownerIds],
      ).then((res) => res.rows);

      return items.map((item) => {
        const itemImages = images.filter((image) => image.item_id === item.id);
        const categoryName = categoryNames.find((category) =>
          category.id === item.category_id
        )?.name;
        const ownerInfo = lessorUserInfo.find((user) =>
          user.user_id === item.owner_id
        );
        const keywordsForItem = keywords.filter((keyword) =>
          keyword.item_id === item.id
        ).map((keyword) => keyword.keyword);
        const address = addresses.find((address) =>
          address.user_id === item.owner_id
        );
        if (!ownerInfo) {
          return;
        }
        return {
          item,
          category: categoryName,
          images: itemImages.map((image) => image.path),
          keywords: keywordsForItem,
          owner_info: { ...ownerInfo, address: address },
        } as FullItem;
      }).filter((data) => data !== undefined);
    },
    `Failed to get items: offset = ${offset}, limit = ${limit}`,
  ).then((res) => res);

export const getItemsByCategory = async (
  id: UUIDTypes,
  offset = 0,
  limit = 30,
): Promise<FullItem[]> =>
  await safeQuery(
    async (client) => {
      const items = await client.query<Item>(
        `SELECT * FROM item WHERE category_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        [id, limit, offset],
      ).then((res) => res.rows);

      const itemIds = items.map((item) => item.id);
      const ownerIds = items.map((item) => item.owner_id);

      const images = await client.query<{ item_id: UUIDTypes; path: string }>(
        `SELECT item_id, path FROM item_image WHERE item_id = ANY($1)`,
        [itemIds],
      ).then((res) => res.rows);

      const keywords = await client.query<Keyword>(
        `SELECT * FROM keyword WHERE item_id = ANY($1)`,
        [itemIds],
      ).then((res) => res.rows);

      const addresses = await client.query<Address>(
        `SELECT * FROM address WHERE user_id = ANY($1)`,
        [ownerIds],
      ).then((res) => res.rows);

      const userInfo = await client.query<UserInfo>(
        `SELECT * FROM user_info WHERE user_id = ANY($1)`,
        [ownerIds],
      ).then((res) => res.rows);

      const categoryIds = [...new Set(items.map((item) => item.category_id))]
        .filter(
          (id): id is UUIDTypes => id !== null,
        );

      const categoryNames = await client.query<{ id: UUIDTypes; name: string }>(
        `SELECT id, name FROM category WHERE id = ANY($1)`,
        [categoryIds],
      ).then((res) => res.rows);

      return items.map((item) => {
        const itemImages = images.filter((img) => img.item_id === item.id);
        const itemKeywords = keywords.filter((k) => k.item_id === item.id).map((
          k,
        ) => k.keyword);
        const owner = userInfo.find((u) => u.user_id === item.owner_id);
        const address = addresses.find((a) => a.user_id === item.owner_id);
        const category = categoryNames.find((c) => c.id === item.category_id)
          ?.name;

        if (!owner) return;

        return {
          item,
          images: itemImages.map((img) => img.path),
          keywords: itemKeywords,
          owner_info: { ...owner, address },
          category,
        } as FullItem;
      }).filter((x) => x !== undefined);
    },
    `Failed to get items by category: ${id}`,
  ).then((res) => res);

export const getItemById = async (id: UUIDTypes, client?: PoolClient): Promise<FullItem> =>
  await safeQuery(async (client) => {
    const item = await client.query<Item>(
      `SELECT * FROM item WHERE id = $1`,
      [id],
    ).then((res) => res.rows[0]);

    const images = await client.query<{ path: string }>(
      `SELECT path FROM item_image WHERE item_id = $1`,
      [id],
    ).then((res) => res.rows.map((r) => r.path));

    const keywords = await client.query<{ keyword: string }>(
      `SELECT keyword FROM keyword WHERE item_id = $1`,
      [id],
    ).then((res) => res.rows.map((r) => r.keyword));

    const categoryName = await client.query<{ name: string }>(
      `SELECT name FROM category WHERE id = $1`,
      [item.category_id],
    ).then((res) => res.rows[0]?.name ?? null);

    const userInfo = await getUserInfoByUserId(item.owner_id, client); // Assume you already have this function

    return {
      item,
      images,
      keywords,
      category: categoryName,
      owner_info: userInfo,
    } as FullItem;
  }, `Failed to get item by ID: ${id}`, client);

export const createItem = async (
  item: Item,
  owner_id: UUIDTypes,
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
        ],
      ),
    `Failed to create item: ${item.item_name}`,
  ).then((res) => res.rows[0]);

export const updateItem = async (
  item: Item,
  owner_id: UUIDTypes,
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
        ],
      ),
    `Failed to update item: ${item.id}`,
  ).then((res) => res.rows[0]);

export const deleteItemById = async (
  itemId: string,
  user_id: UUIDTypes,
): Promise<UUIDTypes> =>
  await safeQuery(
    (client) =>
      client.query<{ id: string }>(
        `DELETE FROM "item" WHERE id = $1 AND owner_id = $2 RETURNING id;`,
        [itemId, user_id],
      ),
    `Failed to delete item: ${itemId}`,
  ).then((res) => res.rows[0]?.id ?? null);

export const addImageToItem = async (
  itemId: string,
  imageUrl: string,
): Promise<string> =>
  await safeQuery(
    (client) =>
      client.query<{ image_url: string }>(
        `INSERT INTO "item_image" (item_id, image_url) VALUES ($1, $2) RETURNING image_url;`,
        [itemId, imageUrl],
      ),
    `Failed to add image to item: ${itemId}`,
  ).then((res) => res.rows[0].image_url);
