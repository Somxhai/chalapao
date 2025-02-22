import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import pg from "pg";

export const auth = betterAuth({
    plugins: [nextCookies()],
    baseURL: process.env.BETTER_AUTH_URL,
    database: new pg.Pool({
        connectionString: process.env.DATABASE_URL
    }),
    emailAndPassword: {
        enabled: true
    },
})
