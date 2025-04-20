import { assertEquals, assertExists } from "jsr:@std/assert";
import { userInfoApp } from "../handler/user_info.ts";
import { createUser } from "./utils.ts";
import { UserInfo, UserInfoRequest } from "../type/user_info.ts";
import { safeQuery } from "../lib/utils.ts";

Deno.test("UserInfo routes", async (t) => {
  const { user, cookie } = await createUser("renter");

  if (!user || !cookie) {
    throw new Error("User creation failed");
  }

  const userInfo: UserInfoRequest = {
    first_name: "John",
    user_id: user.id,
    last_name: "Doe",
    gender: "M",
    birth_date: new Date("1990-01-01"),
    citizen_id: "1234567890123",
    phone_number: "0812345678",
  };

  await t.step("POST /user_info - create user info", async () => {
    const res = await userInfoApp.request("/" + user.id, {
      method: "POST",
      headers: {
        cookie,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    assertEquals(res.status, 200);
    const json = await res.json();
    assertExists(json.id);
  });

  await t.step("GET /user_info - get user info", async () => {
    const res = await userInfoApp.request("/" + user.id, {
      method: "GET",
      headers: {
        cookie,
      },
    });

    assertEquals(res.status, 200);
    const json = await res.json();
    assertEquals(json.first_name, "John");
    assertEquals(json.last_name, "Doe");
  });

  await t.step("PUT /user_info - update user info", async () => {
    const updatedInfo: UserInfoRequest = {
      first_name: "Jane",
      user_id: user.id,
      last_name: "Smith",
      gender: "F",
      birth_date: new Date("1995-05-05"),
      citizen_id: "9876543210987",
      phone_number: "0899999999",
    };

    const res = await userInfoApp.request("/" + user.id, {
      method: "PUT",
      headers: {
        cookie,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedInfo),
    });

    assertEquals(res.status, 200);
    const json: UserInfo = await res.json();
    assertEquals(json.first_name, "Jane");
  });

  await t.step("GET /user_info - get updated user info", async () => {
    const res = await userInfoApp.request("/" + user.id, {
      method: "GET",
      headers: {
        cookie,
      },
    });

    assertEquals(res.status, 200);
    const json: UserInfo = await res.json();
    assertEquals(json.first_name, "Jane");
    assertEquals(json.last_name, "Smith");
  });

  await t.step("GET /user_info - fail if unauthorized", async () => {
    const res = await userInfoApp.request("/" + user.id, {
      method: "GET",
    });

    assertEquals(res.status, 401);
  });

  await t.step("Remove user info if exists", async () => {
    const result = await safeQuery(
      async (client) => {
        const deleteRes = await client.query(
          `DELETE FROM "user_info" WHERE user_id = $1`,
          [user.id],
        );

        return deleteRes.rowCount;
      },
      "Failed to remove user info",
    );

    assertEquals(result, 1);
  });
});
