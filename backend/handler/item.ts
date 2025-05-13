import { Hono } from "hono";
import { UUIDTypes } from "uuid";
import {
  createItem,
  deleteItemById,
  getItemById,
  getItems,
  getItemsByCategory,
  getItemsByUserId,
  updateItem,
} from "../database/service/item.ts";
import { auth } from "../lib/auth.ts";
import { Item } from "../type/app.ts";
import { HTTPException } from "hono/http-exception";
import { tryCatchService } from "../lib/utils.ts";
import { authMiddleware } from "../middleware.ts";
import { deleteImages, saveImages } from "../lib/image.ts";

export const itemApp = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

/**
 * Path: /item/:product_id?
 * @param {UUIDTypes} product_id? - The id of the item to get.
 *
 * id is optional. If id is provided, it will return the item with that id.
 *
 * Situation: User want to get specific item or all items.
 *
 * Response:
 * If id is provided:
 * {...item}
 *
 * If id is NOT provided:
 * [{...item1}, {...item2}, ...]
 */
itemApp.get("/:product_id?", async (c) => {
  const id = c.req.param("product_id");

  if (id) {
    const item = await tryCatchService(() => getItemById(id));
    return c.json(item);
  }

  const offset = parseInt(c.req.query("offset") || "0");
  const limit = parseInt(c.req.query("limit") || "30");

  let items = await tryCatchService(() => getItems(offset, limit));

  items = items.map((item) => {
    const images = item.images?.map((image) => `image/item/${image}`);
    return {
      ...item,
      images,
    };
  });

  return c.json(items);
});

itemApp.get("/all/items", async (c) => {
  const offset = parseInt(c.req.query("offset") || "0");
  const limit = parseInt(c.req.query("limit") || "30");
  const items = await tryCatchService(() => getItems(offset, limit));
  return c.json(items);
});
/**
 * Path: /category/:category_id
 * @param {UUIDTypes} category_id - The id of the category to get items from.
 *
 * Situation: User want to get items from specific category.
 */
itemApp.get("/category/:category_id", async (c) => {
  const id = c.req.param("category_id");
  const offset = parseInt(c.req.query("offset") || "0");
  const limit = parseInt(c.req.query("limit") || "30");
  const items = await tryCatchService(() =>
    getItemsByCategory(id, offset, limit)
  );
  return c.json(items);
});

/**
 * Path: /user/:user_id
 * @param {UUIDTypes} user_id - The id of the user to get items from.
 *
 * Situation: User want to get items from specific user (Lessor).
 */
itemApp.get("/user/:user_id", async (c) => {
  const user_id = c.req.param("user_id");
  const items = await tryCatchService(() => getItemsByUserId(user_id));
  return c.json(items);
});

itemApp.use(authMiddleware);

/**
 * Path: /
 * @description: Create a new item.
 *
 * Situation: Lessor want to create a new item.
 */
itemApp.post("/", async (c) => {
  const body = await c.req.formData();
  const item: Item = JSON.parse(body.get("item") as string);
  const files = body.getAll("files") as File[];

  const user = c.get("user");
  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  const result = await tryCatchService(() => {
    return createItem(item, user.id);
  });
  let paths: string[] = [];

  if (files) {
    paths = await saveImages(files, result.id as UUIDTypes, "item_image");
  }

  return c.json({
    ...result,
    paths,
  });
});
/**
 * Path: /:product_id
 * @param {UUIDTypes} product_id - The id of the item to update.
 * @description: Update an item.
 *
 * Situation: Lessor want to update an item.
 */
itemApp.put("/:product_id", async (c) => {
  const id = c.req.param("product_id");
  const item: Item = await c.req.json();
  item.id = id;
  const user = c.get("user");
  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  const result = await tryCatchService(() => {
    // if (item.owner_id !== user.id) {
    // 	throw new HTTPException(403, { message: "Unauthorized" });
    // }

    return updateItem(item, user.id);
  });
  return c.json(result);
});

/**
 * Path: /:product_id
 * @description: Delete an item.
 *
 * Situation: Lessor want to delete an item.
 */
itemApp.delete("/:product_id", async (c) => {
  const id = c.req.param("product_id");
  const user = c.get("user");
  if (!user) {
    throw new HTTPException(403, { message: "Unauthorized" });
  }

  await deleteImages(id, "item_image");
  const result = await tryCatchService(() => deleteItemById(id, user.id));
  return c.json(result);
});
