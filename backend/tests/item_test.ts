import { assertArrayIncludes, assertEquals } from "jsr:@std/assert";
import { itemApp } from "../handler/item.ts";
import { FullItem, Item } from "../type/app.ts";
import { createTestItem, createUser } from "./utils.ts";

Deno.test("Item routes", async (t) => {
  const { token, user, cookie } = await createUser();

  if (!user || !token || !cookie) {
    throw new Error("User creation failed");
  }

  let createdItem: Item & { paths: string[] };

  await t.step("POST / - create item", async () => {
    const item = await createTestItem(user.id, cookie);
    createdItem = item;
  });

  await t.step("GET /:id - fetch single item", async () => {
    const res = await itemApp.request(`/${createdItem.id}`);
    assertEquals(res.status, 200);
    const fetched: FullItem = await res.json();
    console.log("Items", fetched);
    assertEquals(fetched.item.id, createdItem.id);
  });

  // await t.step("GET / - fetch all items", async () => {
  //   const res = await itemApp.request("/");
  //   assertEquals(res.status, 200);
  //   const items: FullItem[] = await res.json();
  //   console.log("GET / - fetch all items", items);
  //   assertExists(items.find((i) => i.item.id === createdItem.id));
  // });

  await t.step("GET /user/:user_id - fetch items by user", async () => {
    const res = await itemApp.request(`/user/${user.id}`);
    assertEquals(res.status, 200);
    const items: FullItem[] = await res.json();
    assertArrayIncludes(items.map((i) => i.item.id), [createdItem.id]);
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
