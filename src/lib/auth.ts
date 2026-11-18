import {betterAuth} from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma";
import p from "../lib/prisma";
import {admin} from "better-auth/plugins";
import {UserRoles} from "@nct/vtp-common";
import {allowedOrigins, authBaseURL} from "../config/origins";

const prisma = p.prisma;


export const auth = betterAuth({
    baseURL: authBaseURL,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: allowedOrigins,
    plugins: [admin({
        defaultRole: UserRoles.User,
        adminRoles: [UserRoles.Admin],
        adminUserIds: []
    })],
});