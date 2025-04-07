import { Item } from "../../type/app.ts";
import { pool } from "../db.ts";

// Item Functions
export const getItems = async (offset = 0, limit = 30): Promise<Item[]> => {
  const client = await pool.connect();
  try {
    const query = `SELECT * FROM "item" LIMIT $1 OFFSET $2;`;
    const values = [limit, offset];
    const result = await client.queryObject<Item>(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error in getItems:", error);
    throw new Error(
      `Failed to get items: offset = ${offset}, limit = ${limit}`,
    );
  } finally {
    client.release(); // Release the connection after use
  }
};

export const getItemsByCategory = async (
  id: string,
  offset = 0,
  limit = 30,
): Promise<Item[]> => {
  const client = await pool.connect();
  try {
    const query =
      `SELECT * FROM "item" WHERE category_id = $1 LIMIT $2 OFFSET $3;`;
    const values = [id, limit, offset];
    const result = await client.queryObject<Item>(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error in getItemsByCategory:", error);
    throw new Error(`Failed to get items by category: ${id}`);
  } finally {
    client.release();
  }
};

export const getItemsByUserId = async (id: string): Promise<Item[]> => {
  const client = await pool.connect();
  try {
    const query = `SELECT * FROM "item" WHERE owner_id = $1;`;
    const values = [id];
    const result = await client.queryObject<Item>(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error in getItemsByUserId:", error);
    throw new Error(`Failed to get items by user ID: ${id}`);
  } finally {
    client.release();
  }
};

export const getItemById = async (id: string): Promise<Item> => {
  const client = await pool.connect();
  try {
    const query = `SELECT * FROM "item" WHERE id = $1;`;
    const values = [id];
    const result = await client.queryObject<Item>(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error in getItemById:", error);
    throw new Error(`Failed to get item by ID: ${id}`);
  } finally {
    client.release();
  }
};

export const createItem = async (item: Item): Promise<Item> => {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO "item" (owner_id, item_name, description, rental_terms, penalty_terms, item_status, price_per_day, category_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [
      item.owner_id,
      item.item_name,
      item.description,
      item.rental_terms,
      item.penalty_terms,
      item.item_status,
      item.price_per_day,
      item.category_id,
    ];
    const result = await client.queryObject<Item>(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error in createItem:", error);
    throw new Error(`Failed to create item: ${item.id}`);
  } finally {
    client.release();
  }
};

export const updateItem = async (
  item: Item,
): Promise<Item> => {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE "item"
      SET item_name = $1, description = $2, rental_terms = $3, penalty_terms = $4, item_status = $5, price_per_day = $6, category_id = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8;
    `;
    const values = [
      item.item_name,
      item.description,
      item.rental_terms,
      item.penalty_terms,
      item.item_status,
      item.price_per_day,
      item.category_id,
      item.id,
    ];
    const result = await client.queryObject<Item>(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error in updateItem:", error);
    throw new Error(`Failed to update item: ${item.id}`);
  } finally {
    client.release();
  }
};

export const deleteItemById = async (itemId: string): Promise<boolean> => {
  const client = await pool.connect();
  try {
    const query = `DELETE FROM "item" WHERE id = $1 RETURNING id;`;
    const values = [itemId];
    const result = await client.queryObject<{ id: string }>(query, values);
    return result.rows.length > 0;
  } catch (error) {
    console.error("Error in deleteItemById:", error);
    throw new Error(`Failed to delete item: ${itemId}`);
  } finally {
    client.release();
  }
};

export const addImageToItem = async (
  itemId: string,
  imageUrl: string,
): Promise<string> => {
  const client = await pool.connect();
  try {
    const query =
      `INSERT INTO "item_image" (item_id, image_url) VALUES ($1, $2) RETURNING image_url;`;
    const values = [itemId, imageUrl];
    const result = await client.queryObject<{ image_url: string }>(
      query,
      values,
    );
    return result.rows[0].image_url;
  } catch (error) {
    console.error("Error in addImageToItem:", error);
    throw new Error(`Failed to add image to item: ${itemId}`);
  } finally {
    client.release();
  }
};

// Continue adding similar refactored functions for other queries...
