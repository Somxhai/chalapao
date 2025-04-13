import { assertEquals, assertExists } from "jsr:@std/assert";
import { categoryApp } from "../handler/category.ts";
import { createAdmin, createUser } from "./utils.ts";
import { Category } from "../type/app.ts";

Deno.test("Category routes", async (t) => {
  const { token, user, cookie } = await createUser();
  const admin = await createAdmin();

  if (!user || !token || !cookie) {
    throw new Error("User creation failed");
  }

  if (!admin || !admin.token || !admin.user || !admin.cookie) {
    throw new Error("Admin creation failed");
  }

  let createdCategory: Category;

  await t.step("GET / - fetch all categories", async () => {
    const res = await categoryApp.request("/");
    assertEquals(res.status, 200);
    const categories: Category[] = await res.json();
    assertExists(categories);
  });

  await t.step("POST / - create category as admin", async () => {
    // Make sure the user is an admin (you can adjust `user.user_type` as needed for tests)
    const category: Category = {
      name: "Test Create Category",
    };

    const res = await categoryApp.request("/", {
      method: "POST",
      body: JSON.stringify(category),
      headers: {
        cookie: admin.cookie,
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 200);
    createdCategory = await res.json();
    assertEquals(createdCategory.name, category.name);
  });

  await t.step("POST / - create category as non-admin", async () => {
    // Make sure the user is not an admin for this step

    const category: Category = {
      name: "Non-Admin Category",
    };

    const res = await categoryApp.request("/", {
      method: "POST",
      body: JSON.stringify(category),
      headers: {
        cookie,
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 403); // Forbidden for non-admins
  });

  await t.step("PUT /:category_id - update category", async () => {
    const updatedCategory = {
      name: "Updated Category Name",
    };

    const res = await categoryApp.request(`/${createdCategory.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedCategory),
      headers: {
        cookie: admin.cookie,
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 200);
    const updatedRes = await res.json();
    assertEquals(updatedRes.name, updatedCategory.name);
  });

  await t.step("DELETE /:category_id - delete category", async () => {
    user.user_type = "admin";
    const res = await categoryApp.request(`/${createdCategory.id}`, {
      method: "DELETE",
      headers: {
        cookie: admin.cookie,
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 200);
  });
});
