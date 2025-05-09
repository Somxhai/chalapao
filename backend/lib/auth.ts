import { betterAuth } from "better-auth";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../database/db.ts";

export const auth = betterAuth({
  advanced: {
    generateId: () => uuidv4(),
  },

  baseURL: Deno.env.get("BETTER_AUTH_URL"),
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: "user",
    additionalFields: {
      user_info_id: {
        type: "string",
        required: false,
        fieldName: "user_info_id",
      },
      user_type: {
        defaultValue: "renter",
        type: "string",
        fieldName: "user_type",
      },
    },
    fields: {
      name: "name",
      email: "email",
      emailVerified: "email_verified",
      image: "image",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  session: {
    modelName: "session",
    fields: {
      userId: "user_id",
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
      ipAddress: "ip_address",
      userAgent: "user_agent",
    },
  },
  account: {
    modelName: "account",
    fields: {
      accountId: "account_id",
      providerId: "provider_id",
      accessToken: "access_token",
      userId: "user_id",
      createdAt: "created_at",
      password: "password",
      accessTokenExpiresAt: "expires_at",
      idToken: "access_token",
      refreshToken: "refresh_token",
      updatedAt: "updated_at",
      refreshTokenExpiresAt: "refresh_expires_at",
      scope: "scope",
    },
  },
  verification: {
    modelName: "verification",
    fields: {
      identifier: "identifier",
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
});
