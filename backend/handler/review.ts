import { Hono } from "hono";
import { auth } from "../lib/auth.ts";
import { authMiddleware, isRenter } from "../middleware.ts";
import { tryCatchService } from "../lib/utils.ts";
import {
  createReviewItem,
  createReviewUser,
  deleteReview,
  getReviewsByItemId,
  getUserReviewByUserId,
  updateReview,
} from "../database/service/review.ts";
import { HTTPException } from "hono/http-exception";
import { UUIDTypes } from "uuid";

export const reviewApp = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

reviewApp.get("/item/:item_id", async (c) => {
  const item_id = c.req.param("item_id") as UUIDTypes;
  const reviews = await tryCatchService(() => getReviewsByItemId(item_id));
  return c.json(reviews);
});

reviewApp.get("/user/:user_id", async (c) => {
  const user_id = c.req.param("user_id") as UUIDTypes;
  const reviews = await tryCatchService(() => getUserReviewByUserId(user_id));
  return c.json(reviews);
});

// Auth middleware for all routes
reviewApp.use(authMiddleware);

reviewApp.delete("/:review_id", async (c) => {
  const { review_id } = c.req.param();
  const { type }: {
    type: "user" | "item";
  } = await c.req.json();
  const user = c.get("user");
  if (!user?.id) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const deletedId = await tryCatchService(() =>
    deleteReview(review_id, user.id, type, user.user_type === "admin")
  );
  return c.json({ id: deletedId });
});

reviewApp.use(isRenter);

reviewApp.post("/user/:target_id", async (c) => {
  const user = c.get("user");
  const targetId = c.req.param("target_id") as UUIDTypes;
  const { rating, comment }: { rating: number; comment: string } = await c.req
    .json();

  if (!user?.id) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const review = await tryCatchService(() =>
    createReviewUser(user?.id, targetId, rating, comment)
  );
  return c.json(review);
});

reviewApp.post("/item/:item_id", async (c) => {
  const user = c.get("user");
  const itemId = c.req.param("item_id") as UUIDTypes;
  const { rating, comment }: { rating: number; comment: string } = await c.req
    .json();

  if (!user?.id) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const review = await tryCatchService(() =>
    createReviewItem(user?.id, itemId, rating, comment)
  );
  return c.json(review);
});

reviewApp.put("/:review_id", async (c) => {
  const { review_id } = c.req.param();
  const { type }: {
    type: "user" | "item";
  } = await c.req.json();
  const user = c.get("user");
  if (!user?.id) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const { rating, comment }: { rating: number; comment: string } = await c.req
    .json();

  const review = await tryCatchService(() =>
    updateReview(review_id, user.id, rating, comment, type)
  );
  return c.json(review);
});
