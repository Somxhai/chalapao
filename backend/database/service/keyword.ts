import { safeQuery } from "../../lib/utils.ts";
import { UUIDTypes } from "uuid";
import { Keyword } from "../../type/app.ts";

export const createKeywordByItemId = async (
  itemId: UUIDTypes,
  keyword: string,
): Promise<Keyword> =>
  await safeQuery(
    (client) =>
      client.query(
        `INSERT INTO "keyword" (item_id, keyword)
         VALUES ($1, $2) RETURNING *`,
        [itemId, keyword],
      ),
    `Failed to add keyword for item: ${itemId}`,
  ).then((res) => res.rows[0]);

export const deleteKeywordByKeyword = async (
  itemId: UUIDTypes,
  keywords: string[],
): Promise<string[]> =>
  await safeQuery(
    (client) =>
      client.query<Keyword>(
        `DELETE FROM keyword
         WHERE item_id = $1 AND keyword = ANY($2::text[])
         RETURNING keyword;`,
        [itemId, keywords],
      ),
    `Failed to delete keywords for item: ${itemId}`,
  ).then((res) => res.rows.map((row) => row.keyword));
