import {betterAuth} from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma";
import p from "../lib/prisma";
import {admin} from "better-auth/plugins";
import {UserRoles} from "@nct/vtp-common";

const prisma = p.prisma;


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: ["http://localhost:5173"],
    plugins: [admin({
        defaultRole: UserRoles.User,
        adminRoles: [UserRoles.Admin],
        adminUserIds: ["QbeyKYD2tFg0xjAOurg40ecjoGGJD8Fa"]
    })],
});