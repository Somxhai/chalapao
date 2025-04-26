import { assertEquals, assertExists } from "jsr:@std/assert";
import { rentalApp } from "../handler/rental.ts";
import { itemApp } from "../handler/item.ts";
import { createTestItem, createUser } from "./utils.ts";
import { Item } from "../type/app.ts";
import { Rental, RentalAddress } from "../type/rental.ts";
import { UUIDTypes } from "uuid";
import { RentalInput } from "../database/service/rental.ts";

Deno.test("Rental routes", async (t) => {
  const { user: lessorUser, cookie: lessorCookie } = await createUser("lessor");
  const { user: renterUser, cookie: renterCookie } = await createUser("renter");

  if (!lessorUser || !lessorCookie) {
    throw new Error("Lessor creation failed");
  }
  if (!renterUser || !renterCookie) {
    throw new Error("Renter creation failed");
  }

  let item: Item & { paths: string[] };
  let rentalId: UUIDTypes;

  await t.step("Create Item", async () => {
    item = await createTestItem(lessorUser.id, lessorCookie);
  });

  await t.step("POST /rental - create rental", async () => {
    const rental: RentalInput = {
      item_id: item.id as UUIDTypes,
      renter_id: renterUser.id,
      status: "pending",
      start_date: new Date(),
      end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    };

    const return_address: RentalAddress = {
      district: "Test District",
      province: "Test Province",
      type: "return",
      residence_info: "Test Residence Info",
      sub_district: "Test Sub District",
      postal_code: "12345",
    };

    const delivery_address: RentalAddress = {
      district: "Test District",
      province: "Test Province",
      type: "delivery",
      residence_info: "Test Residence Info",
      sub_district: "Test Sub District",
      postal_code: "12345",
    };

    const res = await rentalApp.request("/", {
      method: "POST",
      headers: {
        cookie: renterCookie,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rental,
        return_address,
        delivery_address,
      }),
    });

    assertEquals(res.status, 200);
    const data: Rental = await res.json();
    assertExists(data.id);
    rentalId = data.id;
  });

  await t.step("PUT /rental/:rental_id/status - update status", async () => {
    const res = await rentalApp.request(`/${rentalId}/status`, {
      method: "PUT",
      headers: {
        cookie: lessorCookie,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accepted" }),
    });

    assertEquals(res.status, 200);
    const json: Rental = await res.json();
    assertEquals(json.status, "accepted");
  });

  await t.step("DELETE /rental/:rental_id - delete rental", async () => {
    const res = await rentalApp.request(`/${rentalId}`, {
      method: "DELETE",
      headers: {
        cookie: renterCookie,
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 200);
    const json = await res.json();
    assertEquals(json.id, rentalId);
  });

  await t.step("POST /rental - fail if unauthorized", async () => {
    const rental: RentalInput = {
      item_id: item.id as UUIDTypes,
      renter_id: renterUser.id,
      status: "pending",
      start_date: new Date(),
      end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    };

    const return_address: RentalAddress = {
      district: "Test District",
      province: "Test Province",
      type: "return",
      residence_info: "Test Residence Info",
      sub_district: "Test Sub District",
      postal_code: "12345",
    };

    const delivery_address: RentalAddress = {
      district: "Test District",
      province: "Test Province",
      type: "delivery",
      residence_info: "Test Residence Info",
      sub_district: "Test Sub District",
      postal_code: "12345",
    };

    const res = await rentalApp.request("/", {
      method: "POST",
      headers: {
        cookie: lessorCookie,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rental,
        return_address,
        delivery_address,
      }),
    });

    assertEquals(res.status, 403);
  });

  await t.step("Cleanup item", async () => {
    const res = await itemApp.request(`/${item.id}`, {
      method: "DELETE",
      headers: {
        cookie: lessorCookie,
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 200);
  });
});
