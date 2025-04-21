import { safeQuery } from "../../lib/utils.ts";
import { UUIDTypes } from "uuid";
import { ReviewItem, ReviewUser } from "../../type/review.ts";

export const createReviewItem = async (
  reviewer_id: UUIDTypes,
  item_id: UUIDTypes,
  rating: number,
  comment: string,
): Promise<ReviewItem> =>
  await safeQuery(
    (client) =>
      client.query<ReviewItem>(
        `INSERT INTO review_item (
          reviewer_id, item_id, rating, comment
        ) VALUES ($1, $2, $3, $4)
        RETURNING *;`,
        [reviewer_id, item_id, rating, comment],
      ),
    `Failed to create item review by ${reviewer_id} on item ${item_id}`,
  ).then((res) => res.rows[0]);

export const createReviewUser = async (
  reviewer_id: UUIDTypes,
  user_id: UUIDTypes,
  rating: number,
  comment: string,
): Promise<ReviewUser> =>
  await safeQuery(
    (client) =>
      client.query<ReviewUser>(
        `INSERT INTO "review_user" (
          reviewer_id, user_id, rating, comment
        ) VALUES ($1, $2, $3, $4)
        RETURNING *;`,
        [reviewer_id, user_id, rating, comment],
      ),
    `Failed to create user review by ${reviewer_id} on user ${user_id}`,
  ).then((res) => res.rows[0]);

// Update an existing review (e.g. rating or comment)
export const updateReview = async (
  review_id: UUIDTypes,
  reviewer_id: UUIDTypes,
  rating: number,
  comment: string,
  type: "item" | "user",
): Promise<ReviewItem> => {
  const table = type === "item" ? "review_item" : "review_user";
  return await safeQuery(
    (client) =>
      client.query<ReviewItem>(
        `UPDATE "${table}"
         SET rating = $1, comment = $2
         WHERE id = $3 AND reviewer_id = $4
         RETURNING *;`,
        [rating, comment, review_id, reviewer_id],
      ),
    `Failed to update review ${review_id}`,
  ).then((res) => res.rows[0]);
};

// Delete a review by its ID
export const deleteReview = async (
  review_id: UUIDTypes,
  reviewer_id: UUIDTypes,
  type: "item" | "user",
  isAdmin: boolean = false,
): Promise<UUIDTypes> =>
  await safeQuery(
    (client) => {
      const table = type === "item" ? "review_item" : "review_user";
      return client.query<{ id: UUIDTypes }>(
        `DELETE FROM "${table}"
         WHERE id = $1 ${!isAdmin && "AND reviewer_id = $2"}
         RETURNING id;`,
        [review_id, reviewer_id],
      );
    },
    `Failed to delete review ${review_id}`,
  ).then((res) => res.rows[0]?.id);

// Get all reviews for a given item
export const getReviewsByItemId = async (
  item_id: UUIDTypes,
): Promise<(ReviewItem & { images: string[] })[]> =>
  await safeQuery(
    (client) =>
      client.query<ReviewItem & { image_url: string | null }>(
        `SELECT review.*
         FROM "review_item" review
        LEFT JOIN "review_item_image" image
        ON review.id = image.review_id
         WHERE item_id = $1;`,
        [item_id],
      ),
    `Failed to fetch reviews for item ${item_id}`,
  ).then((res) => {
    const map = new Map<UUIDTypes, ReviewItem & { images: string[] }>();
    const rows = res.rows;
    for (const row of rows) {
      if (!map.has(row.id)) {
        const image = row.image_url ? [row.image_url] : [];
        map.set(row.id, {
          ...row,
          images: image,
        });
        continue;
      }
      const current = map.get(row.id);
      if (current && row.image_url) {
        current.images.push(row.image_url);
      }
    }
    return Array.from(map.values());
  });

// Get all reviews for a given user
export const getUserReviewByUserId = async (
  user_id: UUIDTypes,
): Promise<ReviewUser[]> =>
  await safeQuery(
    (client) =>
      client.query<ReviewUser>(
        `SELECT * FROM "review_user"
         WHERE user_id = $1;`,
        [user_id],
      ),
    `Failed to fetch reviews for user ${user_id}`,
  ).then((res) => res.rows);
