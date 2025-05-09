import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
	createUserInfo,
	getUserInfoByUserId,
	updateUserInfoByUserId,
} from "../database/service/user_info.ts";
import { auth } from "../lib/auth.ts";
import { tryCatchService } from "../lib/utils.ts";
import { authMiddleware } from "../middleware.ts";
import { UserInfoRequest } from "../type/user_info.ts";

export const userInfoApp = new Hono<{
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null;
	};
}>();

// Middleware for auth
userInfoApp.use(authMiddleware);

/**
 * Path: /
 * @description: Get user info by logged-in user id
 *
 * Situation: Logged-in user wants to view their user information.
 */
userInfoApp.get("/:user_id", async (c) => {
	const user_id = c.req.param("user_id");
	const user = c.get("user");

	if (!user || user.id !== user_id) {
		throw new HTTPException(401, { message: "Unauthorized" });
	}

	const info = await tryCatchService(() => getUserInfoByUserId(user_id));
	if (!info) {
		throw new HTTPException(404, { message: "User info not found" });
	}
	return c.json(info);
});

/**
 * Path: /
 * @description: Create user info
 *
 * Situation: New user registers and fills out their user information.
 */
userInfoApp.post("/:user_id", async (c) => {
	const user_id = c.req.param("user_id");
	const user = c.get("user");
	const userInfo: UserInfoRequest = await c.req.json();

	if (!user || user.id !== user_id) {
		throw new HTTPException(401, { message: "Unauthorized" });
	}

	userInfo.user_id = user_id;

	const result = await tryCatchService(() => createUserInfo(userInfo));
	return c.json({ id: result });
});

/**
 * Path: /
 * @description: Update user info by logged-in user id
 *
 * Situation: Logged-in user wants to update their profile info.
 */
userInfoApp.put("/:user_id", async (c) => {
	const user = c.get("user");
	const user_id = c.req.param("user_id");
	if (!user || user.id !== user_id) {
		throw new HTTPException(401, { message: "Unauthorized" });
	}

	const userInfo: UserInfoRequest = await c.req.json();

	const result = await tryCatchService(() =>
		updateUserInfoByUserId(userInfo, user_id)
	);

	return c.json(result);
});
