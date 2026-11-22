import { betterAuth } from "better-auth";
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
    }
});
