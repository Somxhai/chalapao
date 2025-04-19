import { Hono } from "hono";
import { addImageToReview } from "../database/service/review_image.ts";
import { tryCatchService } from "../lib/utils.ts";
import { authMiddleware } from "../middleware.ts";
import { auth } from "../lib/auth.ts";
import { UUIDTypes } from "uuid";

export const reviewImageApp = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

reviewImageApp.use(authMiddleware);

/**
 * Path: /review-image/
 * Description: Add an image to a review (must be authenticated)
 */
reviewImageApp.post("/", async (c) => {
  const body = await c.req.json();
  const { review_id, image_url }: { review_id: UUIDTypes; image_url: string } = body;

  const result = await tryCatchService(() => addImageToReview(review_id, image_url));
  return c.json({ image_url: result });
});
