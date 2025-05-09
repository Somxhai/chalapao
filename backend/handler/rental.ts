import { Hono } from "hono";
import { RentalAddress } from "../type/rental.ts";
import { auth } from "../lib/auth.ts";
import { authMiddleware, isRenter } from "../middleware.ts";
import { tryCatchService } from "../lib/utils.ts";
import {
  createRental,
  deleteRental,
  getRentalById,
  getRentalsAssociateWithItemOwner,
  getRentalsByUserId,
  RentalInput,
  updateRentalStatus,
} from "../database/service/rental.ts";
import { HTTPException } from "hono/http-exception";

export const rentalApp = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

rentalApp.use(authMiddleware);

/**
 * GET /rental/:rental_id
 * @description Get rental details by rental ID.
 */
rentalApp.get("/:rental_id", async (c) => {
  const rentalId = c.req.param("rental_id");

  const rental = await tryCatchService(() => getRentalById(rentalId));

  return c.json(rental);
});

/**
 * GET /rentals/user/:user_id
 * @description Get all rentals by user ID.
 */
rentalApp.get("/user/:user_id", async (c) => {
  const userId = c.req.param("user_id");

  const rentals = await tryCatchService(() => getRentalsByUserId(userId));

  return c.json(rentals);
});

rentalApp.get("/lessor/:owner_id", async (c) => {
  const ownerId = c.req.param("owner_id");

  const rentals = await tryCatchService(() =>
    getRentalsAssociateWithItemOwner(ownerId)
  );

  return c.json(rentals);
});

/**
 * PUT /rental/:rental_id/status
 * @description Update rental status.
 * Body: { status: string }
 *
 * Description: Update the status of a rental.
 * NOTE: This should be done by server?
 */
rentalApp.put("/:rental_id/status", async (c) => {
  const rentalId = c.req.param("rental_id");
  const { status }: { status: string } = await c.req.json();

  const result = await tryCatchService(() =>
    updateRentalStatus(rentalId, status)
  );

  return c.json(result);
});

/**
 * DELETE /rental/:rental_id
 * @description Delete a rental.
 *
 * NOTE: When renter tries to cancel a rental
 */
rentalApp.delete("/:rental_id", async (c) => {
  const rentalId = c.req.param("rental_id");

  const deletedId = await tryCatchService(() => deleteRental(rentalId));
  return c.json({ id: deletedId });
});

rentalApp.use(isRenter);
/**
 * POST /rental
 * @description Create a new rental.
 */
rentalApp.post("/", async (c) => {
  const {
    rental,
    return_address,
    delivery_address,
  }: {
    rental: RentalInput;
    return_address: RentalAddress;
    delivery_address: RentalAddress;
  } = await c.req.json();

  const user = c.get("user");

  if (!user || user.id !== rental.renter_id) {
    throw new HTTPException(403, { message: "Unauthorized" });
  }

  const result = await tryCatchService(() =>
    createRental(rental, return_address, delivery_address)
  );
  return c.json(result);
});
