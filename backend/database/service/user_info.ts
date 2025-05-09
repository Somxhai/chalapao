import { UUIDTypes } from "uuid";
import { safeQuery } from "../../lib/utils.ts";
import { Address, UserInfo, UserInfoRequest } from "../../type/user_info.ts";
import { PoolClient } from "pg";

// Get user_info by user_id (new schema)
export const getUserInfoByUserId = async (
	userId: UUIDTypes,
	client?: PoolClient
): Promise<UserInfo & { address: Address }> =>
	await safeQuery(
		(client) =>
			client.query<{ user_info: UserInfo; address: Address }>(
				`SELECT row_to_json(user_info) user_info,
row_to_json(address) address FROM "user_info"
LEFT JOIN address ON address.user_id = $1
WHERE user_info.user_id = $1 LIMIT 1;`,
				[userId]
			),
		`Failed to get user info: ${userId}`,
		client
	).then((res) => {
		const row = res.rows[0];
		return {
			...row.user_info,
			address: row.address,
		};
	});

export const getUserInfoByUserIds = async (
	userIds: UUIDTypes[],
	client?: PoolClient
): Promise<(UserInfo & { address: Address })[]> =>
	await safeQuery(
		(client) =>
			client.query<{ user_info: UserInfo; address: Address }>(
				`SELECT row_to_json(user_info) user_info,
row_to_json(address) address FROM "user_info"
LEFT JOIN address ON address.user_id = ANY($1)
WHERE user_info.user_id = ANY($1) LIMIT 1;`,
				[userIds]
			),
		`Failed to get user info: ${userIds}`,
		client
	).then((res) => {
		const rows = res.rows;
		return rows.map((row) => ({
			...row.user_info,
			address: row.address,
		}));
	});

// Create user_info for a user (new schema)
export const createUserInfo = async (
	user_info: UserInfoRequest
): Promise<UserInfo> => {
	return await safeQuery(async (client) => {
		try {
			await client.query("BEGIN");

			// Ensure user doesn't already have a user_info
			const existing = await client.query(
				`SELECT id FROM "user_info" WHERE user_id = $1 LIMIT 1;`,
				[user_info.user_id]
			);
			if ((existing.rowCount ?? 0) > 0) {
				throw new Error("User info already exists");
			}

			// Ensure citizen ID is unique
			const existingCitizenId = await client.query(
				`SELECT id FROM "user_info" WHERE citizen_id = $1 LIMIT 1;`,
				[user_info.citizen_id]
			);
			if ((existingCitizenId.rowCount ?? 0) > 0) {
				throw new Error("Citizen ID already exists");
			}

			const {
				first_name,
				last_name,
				gender,
				user_id,
				birth_date,
				citizen_id,
				phone_number,
			} = user_info;

			const result = await client.query<UserInfo>(
				`INSERT INTO "user_info" (
            user_id, first_name, last_name, gender, birth_date, citizen_id, phone_number
           ) VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING *;`,
				[
					user_id,
					first_name,
					last_name,
					gender,
					birth_date,
					citizen_id,
					phone_number,
				]
			);

			await client.query("COMMIT");
			return result.rows[0];
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		}
	}, `Failed to create user info`);
};

// Update user_info by user_id (new schema)
export const updateUserInfoByUserId = async (
	user_info: UserInfoRequest,
	userId: UUIDTypes
): Promise<UserInfo> =>
	await safeQuery(async (client) => {
		const {
			first_name,
			last_name,
			gender,
			birth_date,
			citizen_id,
			phone_number,
		} = user_info;

		return await client.query<UserInfo>(
			`UPDATE "user_info"
         SET first_name = $1,
             gender = $2,
             birth_date = $3,
             citizen_id = $4,
             phone_number = $5,
             last_name = $6
         WHERE user_id = $7
         RETURNING *;`,
			[
				first_name,
				gender,
				birth_date,
				citizen_id,
				phone_number,
				last_name,
				userId,
			]
		);
	}, `Failed to update user info for user: ${userId}`).then(
		(res) => res.rows[0]
	);
