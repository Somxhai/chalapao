import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    baseURL: process.env.DATABASE_URL // the base url of your auth server
})

