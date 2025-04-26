import {
  assertArrayIncludes,
  assertEquals,
  assertExists,
} from "jsr:@std/assert";
import { itemApp } from "../handler/item.ts";
import { Item } from "../type/app.ts";
import { createUser } from "./utils.ts";

Deno.test("Item routes", async (t) => {
  const { token, user, cookie } = await createUser();

  if (!user || !token || !cookie) {
    throw new Error("User creation failed");
  }

  const newItem: Item = {
    owner_id: user.id, // use the actual logged-in user's id
    price_per_day: 100,
    description: "A test item",
    item_name: "Test item",
    penalty_terms: "A test penalty term",
    rental_terms: "A test rental term",
    item_status: "available",
  };

  let createdItem: Item;

  // console.log("Headers", response.headers);
  //
  // console.log(
  //   "session",
  //   await auth.api.getSession({
  //     headers: response.headers,
  //   }),
  // );

  await t.step("POST / - create item", async () => {
    const res = await itemApp.request("/", {
      method: "POST",
      body: JSON.stringify(newItem),
      headers: {
        cookie,
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 200);
    createdItem = await res.json();
    assertEquals(createdItem.item_name, newItem.item_name);
    assertEquals(createdItem.owner_id, user.id);
  });

  await t.step("GET /:id - fetch single item", async () => {
    const res = await itemApp.request(`/${createdItem.id}`);
    assertEquals(res.status, 200);
    const fetched = await res.json();
    assertEquals(fetched.id, createdItem.id);
  });

  await t.step("GET / - fetch all items", async () => {
    const res = await itemApp.request("/");
    assertEquals(res.status, 200);
    const items: Item[] = await res.json();
    assertExists(items.find((i) => i.id === createdItem.id));
  });

  await t.step("GET /user/:user_id - fetch items by user", async () => {
    const res = await itemApp.request(`/user/${user.id}`);
    assertEquals(res.status, 200);
    const items: Item[] = await res.json();
    assertArrayIncludes(items.map((i) => i.id), [createdItem.id]);
  });

  await t.step("PUT /:id - update item", async () => {
    const updated = { ...createdItem, item_name: "Updated Lamp" };
    const res = await itemApp.request(`/${createdItem.id}`, {
      method: "PUT",
      body: JSON.stringify(updated),
      headers: {
        cookie,
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 200);
    const updatedRes = await res.json();
    assertEquals(updatedRes.item_name, "Updated Lamp");
  });

  await t.step("DELETE /:id - delete item", async () => {
    const res = await itemApp.request(`/${createdItem.id}`, {
      method: "DELETE",
      headers: {
        cookie,
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 200);
  });
});
