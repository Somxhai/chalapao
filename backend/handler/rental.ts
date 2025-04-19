import { Hono } from "hono";
import { createRental, updateRentalStatus, deleteRental } from "../database/service/rental.ts";
import { tryCatchService } from "../lib/utils.ts";
import { authMiddleware } from "../middleware.ts";
import { auth } from "../lib/auth.ts";
import { UUIDTypes } from "uuid";

export const rentalApp = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

rentalApp.use(authMiddleware);

/**
 * Path: /rental/
 * Description: Create a rental
 */
rentalApp.post("/", async (c) => {
  const {
    item_id,
    delivery_address,
    payment_id,
    status,
    start_date,
    end_date,
  } = await c.req.json();

  const renterId = c.var.user!.id;

  const result = await tryCatchService(() =>
    createRental(
      renterId,
      item_id,
      delivery_address,
      payment_id,
      status,
      start_date,
      end_date,
    )
  );

  return c.json({ rental_id: result });
});

/**
 * Path: /rental/:rental_id
 * Description: Update rental status
 */
rentalApp.put("/:rental_id", async (c) => {
  const rentalId: UUIDTypes = c.req.param("rental_id");
  const { status } = await c.req.json();

  const result = await tryCatchService(() => updateRentalStatus(rentalId, status));
  return c.json({ updated: result > 0 });
});

/**
 * Path: /rental/:rental_id
 * Description: Delete a rental (only if status is 'canceled')
 */
rentalApp.delete("/:rental_id", async (c) => {
  const rentalId: UUIDTypes = c.req.param("rental_id");

  const result = await tryCatchService(() => deleteRental(rentalId));
  return c.json({ deleted_rental_id: result });
});
