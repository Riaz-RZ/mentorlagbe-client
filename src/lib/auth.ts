import { betterAuth } from "better-auth";
import { admin, jwt } from "better-auth/plugins";
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
            signupRole: {
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
        autoSignIn: false,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },

    // Admin plugin -> /api/auth/admin/* endpoints (list users, set role,
    // ban/unban). They only work for sessions whose role is "admin".
    plugins: [admin(), jwt()],
    session: {
        cookieCache: {
            enabled: true,
            strategy: 'jwt',
            maxAge: 7 * 24 * 60 * 60
        }
    },
    // The admin plugin reserves `role` as a server-managed field. Map the
    // validated student/tutor signup choice to it here.
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    const { signupRole, ...userData } = user;

                    return {
                        data: {
                            ...userData,
                            role: signupRole === "tutor" ? "tutor" : "student",
                        },
                    };
                },
            },
        },
    },
});
