import { Hono } from "hono";
import {
  getUserInfoByUserId,
  createUserInfo,
  updateUserInfoByUserId,
} from "../database/service/user_info.ts";
import { authMiddleware } from "../middleware.ts";
import { tryCatchService } from "../lib/utils.ts";
import { auth } from "../lib/auth.ts";

export const userInfoApp = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

// Auth middleware (ต้องล็อกอินเพื่อเข้าถึง user_info)
userInfoApp.use(authMiddleware);

/**
 * GET /user-info
 * ดึง user info ของผู้ใช้ที่ล็อกอินอยู่
 */
userInfoApp.get("/", async (c) => {
  const user = c.get("user");
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const userInfo = await tryCatchService(() =>
    getUserInfoByUserId(user.id)
  );
  return c.json(userInfo);
});

/**
 * POST /user-info
 * สร้าง user info ให้ผู้ใช้ (ใช้ตอนสมัคร หรือกรอกโปรไฟล์ครั้งแรก)
 */
userInfoApp.post("/", async (c) => {
  const {
    fullName,
    gender,
    birthDate,
    citizenId,
    phoneNumber,
  } = await c.req.json();

  const id = await tryCatchService(() =>
    createUserInfo(fullName, gender, birthDate, citizenId, phoneNumber)
  );

  return c.json({ id }, 201);
});

/**
 * PUT /user-info
 * แก้ไข user info ของผู้ใช้ที่ล็อกอินอยู่
 */
userInfoApp.put("/", async (c) => {
  const user = c.get("user");
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const {
    fullName,
    gender,
    birthDate,
    citizenId,
    phoneNumber,
  } = await c.req.json();

  const updated = await tryCatchService(() =>
    updateUserInfoByUserId(user.id, fullName, gender, birthDate, citizenId, phoneNumber)
  );

  return c.json({ updated });
});
