import { safeQuery } from "../../lib/utils.ts";
import { UUIDTypes } from "uuid";

export const addImageToReview = async (
  reviewId: UUIDTypes,
  imageUrl: string,
): Promise<string> =>
  await safeQuery(
    (client) =>
      client.query<{ image_url: string }>(
        `INSERT INTO "review_image" (review_id, image_url)
         VALUES ($1, $2) RETURNING image_url;`,
        [reviewId, imageUrl],
      ),
    `Failed to add image to review: ${reviewId}`,
  ).then((res) => res.rows[0].image_url);
