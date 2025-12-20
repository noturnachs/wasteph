import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";
import * as schema from "./schema.js";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

// Create postgres client with SSL for production databases (like Render)
export const client = postgres(connectionString, {
  ssl: "require",
});

// Create drizzle instance
export const db = drizzle(client, { schema });

// Test connection
export const testConnection = async () => {
  try {
    await client`SELECT 1`;
    console.log("✅ Database connected successfully");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};
