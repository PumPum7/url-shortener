import { betterAuth } from "better-auth";
import { getXataClient } from "./xata";
import { XataDialect } from "@xata.io/kysely";
import { nextCookies } from "better-auth/next-js";

const xata = getXataClient();

export const auth = betterAuth({
    database: {
        dialect: new XataDialect({ xata }),
        type: "postgres",
    },
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        },
    },
    plugins: [nextCookies()],
});
