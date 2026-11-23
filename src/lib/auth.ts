import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.DB_URI as string);
const db = client.db("mentorlagbe");

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),
    user: {
        additionalFields: {
            role: {
                type: ["student", "tutor"],
                required: true,
                input: true,
            },
            // "free" | "pro" - only the Stripe verify endpoint sets this
            // (input: false so clients can never set it themselves).
            plan: {
                type: "string",
                required: false,
                input: false,
                defaultValue: "free",
            }
        }
    },
    emailAndPassword: {
        enabled: true,
    },
    // Admin plugin -> /api/auth/admin/* endpoints (list users, set role,
    // ban/unban). They only work for sessions whose role is "admin".
    plugins: [admin()],
    // Better Auth does not validate the role value sent to signup, so a
    // crafted request could register as "admin". Only student/tutor can be
    // created here - admins are promoted directly in the DB later (D3).
    databaseHooks: {
        user: {
            create: {
                before: async (user) => ({
                    data: {
                        ...user,
                        role: user.role === "tutor" ? "tutor" : "student",
                    },
                }),
            },
        },
    },
});
