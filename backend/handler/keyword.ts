import { Hono } from "hono";
import { createKeywordByItemId, deleteKeywordByKeyword } from "../database/service/keyword.ts";
import { authMiddleware } from "../middleware.ts";
import { tryCatchService } from "../lib/utils.ts";
import { auth } from "../lib/auth.ts";
import { UUIDTypes } from "uuid";

export const keywordApp = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

keywordApp.use(authMiddleware);

/**
 * Path: /keyword/
 * Description: Add a keyword to an item
 */
keywordApp.post("/", async (c) => {
  const { item_id, keyword }: { item_id: UUIDTypes; keyword: string } = await c.req.json();

  const result = await tryCatchService(() => createKeywordByItemId(item_id, keyword));
  return c.json({ added_keyword: result });
});

/**
 * Path: /keyword/:item_id/:keyword
 * Description: Delete a keyword by item ID and keyword string
 */
keywordApp.delete("/:item_id/:keyword", async (c) => {
  const itemId = c.req.param("item_id");
  const keyword = decodeURIComponent(c.req.param("keyword"));

  const result = await tryCatchService(() => deleteKeywordByKeyword(itemId, keyword));
  return c.json({ deleted_keyword: result });
});
