import { safeQuery } from "../../lib/utils.ts";
import { UUIDTypes } from "uuid";
import { Keyword } from "../../type/app.ts";

export const createKeywordsByItemId = async (
  itemId: UUIDTypes,
  keywords: string[],
): Promise<Keyword[]> =>
  await safeQuery(
    async (client) => {
      const result = await client.query<Keyword>(
        `INSERT INTO "keyword" (item_id, keyword)
         SELECT $1, unnest($2::text[])
         RETURNING *;`,
        [itemId, keywords],
      );
      return result.rows;
    },
    `Failed to add keywords for item: ${itemId}`,
  );

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

export const getKeywordsById = async (
  keywordId: UUIDTypes,
) =>
  await safeQuery(
    (client) =>
      client.query<Keyword>(`SELECT * FROM keyword WHERE id = $1;`, [
        keywordId,
      ]),
    `Failed to get keyword by id: ${keywordId}`,
  );
