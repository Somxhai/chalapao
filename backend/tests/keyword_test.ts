import { assertEquals, assertExists } from "jsr:@std/assert";
import { keywordApp } from "../handler/keyword.ts";
import { itemApp } from "../handler/item.ts";
import { createUser } from "./utils.ts";
import { Item, Keyword } from "../type/app.ts";
import { UUIDTypes } from "uuid";

Deno.test("Keyword routes", async (t) => {
  const { user: lessorUser, cookie: lessorCookie, token: lessorToken } =
    await createUser("lessor");
  const { user: renterUser, cookie: renterCookie, token: renterToken } =
    await createUser("renter");

  if (!lessorToken || !lessorUser || !lessorCookie) {
    throw new Error("Lessor creation failed");
  }

  if (!renterToken || !renterUser || !renterCookie) {
    throw new Error("Renter creation failed");
  }

  const newItem: Item = {
    owner_id: lessorUser.id, // use the actual logged-in user's id
    price_per_day: 100,
    description: "A test item",
    item_name: "Test item",
    penalty_terms: "A test penalty term",
    rental_terms: "A test rental term",
    item_status: "available",
  };

  // You can insert a mock item into your DB or use a known one for testing
  let itemId: UUIDTypes; // Replace with a real or mocked ID

  await t.step("Create Item for testing", async () => {
    const res = await itemApp.request("/", {
      method: "POST",
      headers: {
        cookie: lessorCookie,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    });
    assertEquals(res.status, 200);
    const createdItem: Item = await res.json();
    if (!createdItem) throw new Error("Item creation failed");
    if (createdItem.id) itemId = createdItem.id;
  });

  const keywordBody = {
    keywords: ["example-keyword", "another-keyword"],
  };

  let createdKeyword: Keyword[];

  await t.step("POST /:item_id - create keyword", async () => {
    const res = await keywordApp.request(`/${itemId}`, {
      method: "POST",
      body: JSON.stringify(keywordBody),
      headers: {
        cookie: lessorCookie,
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 200);
    const data: Keyword[] = await res.json();
    assertEquals(data.map((v) => v.keyword), keywordBody.keywords);
    createdKeyword = data;
  });

  await t.step("DELETE /:item_id - delete keyword", async () => {
    const res = await keywordApp.request(`/${itemId}`, {
      method: "DELETE",
      body: JSON.stringify({
        keywords: createdKeyword.map((v) => v.keyword),
      }),
      headers: {
        cookie: lessorCookie,
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 200);
    const json: { keywords: string[] } = await res.json();
    assertEquals(json.keywords, createdKeyword.map((v) => v.keyword));
  });

  await t.step("POST /:item_id - fail if not lessor", async () => {
    const res = await keywordApp.request(`/${itemId}`, {
      method: "POST",
      body: JSON.stringify(keywordBody),
      headers: {
        cookie: renterCookie,
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 403);
  });

  await t.step("Delete item", async () => {
    if (!itemId) {
      throw new Error("Item ID is not defined");
    }
    const res = await itemApp.request(`/${itemId}`, {
      method: "DELETE",
      headers: {
        cookie: lessorCookie,
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 200);
  });
});
