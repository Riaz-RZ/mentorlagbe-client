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
            }
        }
    },
    emailAndPassword: {
        enabled: true,
    }
});
