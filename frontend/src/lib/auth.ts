import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import pg from "pg";
import { v4 as uuidv4 } from "uuid";

export const auth = betterAuth({
    plugins: [nextCookies()],
    advanced: {
        generateId: () => uuidv4(),
    },
    baseURL: process.env.BETTER_AUTH_URL,
    database: new pg.Pool({
        connectionString: process.env.DATABASE_URL
    }),
    emailAndPassword: {
        enabled: true
    },
    user: {
        modelName: "user",
        additionalFields: {
            user_info_id: {
                type: "string",
                fieldName: "user_info_id"
            },
            user_type: {
                type: "string",
                fieldName: "user_type"
            }
        },
        fields: {
            name: "name",
            email: "email",
            emailVerified: "email_verified",
            image: "image",
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
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
        }
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
        }
    },
    verification: {
        modelName: "verification",
        fields: {
            identifier: "identifier",
            expiresAt: "expires_at",
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    }
})
