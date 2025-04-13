import { safeQuery } from "../../lib/utils.ts";
import { UserInfo } from "../../type/app.ts";

export const getUserInfoByUserId = async (
  userId: string,
): Promise<UserInfo | null> =>
  await safeQuery(
    (client) =>
      client.query<UserInfo>(
        `SELECT * FROM "user_info" WHERE id = (
           SELECT user_info_id FROM "user" WHERE id = $1
         );`,
        [userId],
      ),
    `Failed to get user info: ${userId}`,
  ).then((res) => res.rows[0] ?? null);

export const createUserInfo = async (
  fullName: string,
  gender: string,
  birthDate: string,
  citizenId: string,
  phoneNumber: string,
): Promise<string | null> =>
  await safeQuery(
    (client) =>
      client.query<{ id: string }>(
        `INSERT INTO "user_info" (
           full_name, gender, birth_date, citizen_id, phone_number
         ) VALUES ($1, $2, $3, $4, $5)
         RETURNING id;`,
        [fullName, gender, birthDate, citizenId, phoneNumber],
      ),
    `Failed to create user info`,
  ).then((res) => res.rows[0]?.id ?? null);

export const updateUserInfoByUserId = async (
  userId: string,
  fullName: string,
  gender: string,
  birthDate: string,
  citizenId: string,
  phoneNumber: string,
): Promise<number> =>
  await safeQuery(
    (client) =>
      client.query(
        `UPDATE "user_info"
         SET full_name = $1, gender = $2, birth_date = $3,
             citizen_id = $4, phone_number = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = (SELECT user_info_id FROM "user" WHERE id = $6) RETURNING *;`,
        [fullName, gender, birthDate, citizenId, phoneNumber, userId],
      ),
    `Failed to update user info for user: ${userId}`,
  ).then((res) => res.rowCount ?? 0);
