import { Hono } from "hono";
import { auth } from "../lib/auth.ts";
import { tryCatchService } from "../lib/utils.ts";
import { authMiddleware, isLessor } from "../middleware.ts";
import {
  createKeywordsByItemId,
  deleteKeywordByKeyword,
} from "../database/service/keyword.ts";

export const keywordApp = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

keywordApp.use(authMiddleware);
keywordApp.use(isLessor);

/**
 * Path: /keyword/:item_id
 * @method POST
 * @description Create a new keyword for the given item.
 * Body: { keyword: string }
 */
keywordApp.post("/:item_id", async (c) => {
  const itemId = c.req.param("item_id");
  const { keywords }: { keywords: string[] } = await c.req.json();

  const result = await tryCatchService(() =>
    createKeywordsByItemId(itemId, keywords)
  );

  return c.json(result);
});

/**
 * Path: /keyword/:item_id
 * @method DELETE
 * @description Delete keywords for the given item.
 * Body: { keywords: string[] }
 */
keywordApp.delete("/:item_id", async (c) => {
  const itemId = c.req.param("item_id");
  const { keywords }: { keywords: string[] } = await c.req.json();

  const deletedKeyword = await tryCatchService(() =>
    deleteKeywordByKeyword(itemId, keywords)
  );

  return c.json({ keywords: deletedKeyword });
});
