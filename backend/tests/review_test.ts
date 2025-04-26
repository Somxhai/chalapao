import { assertEquals, assertExists } from "jsr:@std/assert";
import { reviewApp } from "../handler/review.ts";
import { createUser } from "./utils.ts";
import { Item } from "../type/app.ts";
import { itemApp } from "../handler/item.ts";
import { ReviewItem, ReviewUser } from "../type/review.ts";
import { createReviewUser } from "../database/service/review.ts";

Deno.test("Review routes", async (t) => {
  const { token, user, cookie } = await createUser();
  const { token: lessorToken, user: lessorUser, cookie: lessorCookie } =
    await createUser("lessor");
  if (!user || !token || !cookie) {
    throw new Error("User creation failed");
  }

  if (!lessorUser || !lessorToken || !lessorCookie) {
    throw new Error("Lessor creation failed");
  }

  const newItem: Item = {
    owner_id: user.id,
    price_per_day: 100,
    description: "Test item for rental",
    item_name: "Rental item",
    penalty_terms: "Penalty",
    rental_terms: "Rental",
    item_status: "available",
  };
  let item: Item;

  await t.step("Create Item", async () => {
    const res = await itemApp.request("/", {
      method: "POST",
      headers: {
        cookie: cookie,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    });

    assertEquals(res.status, 200);
    const created: Item = await res.json();
    assertExists(created.id);
    if (created) {
      item = created;
    }
  });

  let createdReviewItem: ReviewItem;

  await t.step("POST /item/:target_id - create review for item", async () => {
    const res = await reviewApp.request(`/item/${item.id}`, {
      method: "POST",
      body: JSON.stringify({
        rating: 5,
        comment: "Great item!",
        type: "item",
      }),
      headers: {
        cookie,
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 200);
    createdReviewItem = await res.json();
    assertEquals(createdReviewItem.rating, 5);
    assertEquals(createdReviewItem.comment, "Great item!");
    assertEquals(createdReviewItem.item_id, item.id);
  });

  let createdReviewUser: ReviewUser;

  await t.step("POST /user/:target_id - create review for user", async () => {
    const res = await reviewApp.request(`/user/${lessorUser.id}`, {
      method: "POST",
      body: JSON.stringify({
        rating: 4,
        comment: "Great user!",
        type: "user",
      }),
      headers: {
        cookie,
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 200);
    createdReviewUser = await res.json();
    assertEquals(createdReviewUser.reviewer_id, user.id);
  });

  await t.step("GET /user/:user_id - fetch reviews by user id", async () => {
    const res = await reviewApp.request(`/user/${lessorUser.id}`);
    assertEquals(res.status, 200);
    const reviews: ReviewUser[] = await res.json();
    assertEquals(reviews[0].user_id, lessorUser.id);
  });

  await t.step("DELETE /:target_id - delete review by user id", async () => {
    const res = await reviewApp.request(`/${createdReviewUser.id}`, {
      method: "DELETE",
      body: JSON.stringify({
        type: "user",
      }),
      headers: {
        cookie,
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 200);
    const result = await res.json();
    assertEquals(result.id, createdReviewUser.id);
  });

  await t.step("GET /item/:item_id - fetch reviews by item id", async () => {
    const res = await reviewApp.request(`/item/${item.id}`);
    assertEquals(res.status, 200);
    const reviews: (ReviewItem & { images: string[] })[] = await res.json();
    assertEquals(reviews.length, 1);
  });

  await t.step("PUT /:review_id - update review", async () => {
    const res = await reviewApp.request(`/${createdReviewItem.id}`, {
      method: "PUT",
      body: JSON.stringify({
        rating: 4,
        comment: "Updated review",
        type: "item",
      }),
      headers: {
        cookie,
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 200);
    const updated = await res.json();
    assertEquals(updated.comment, "Updated review");
    assertEquals(updated.rating, 4);
  });

  await t.step("DELETE /:review_id - delete review", async () => {
    const res = await reviewApp.request(`/${createdReviewItem.id}`, {
      method: "DELETE",
      body: JSON.stringify({
        type: "item",
      }),
      headers: {
        cookie,
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 200);
    const result = await res.json();
    assertEquals(result.id, createdReviewItem.id);
  });

  await t.step("DELETE item - cleanup", async () => {
    const res = await itemApp.request(`/${item.id}`, {
      method: "DELETE",
      headers: {
        cookie,
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 200);
  });
});
