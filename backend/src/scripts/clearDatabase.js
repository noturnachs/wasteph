import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";
import {
  userTable,
  sessionTable,
  inquiryTable,
  leadTable,
  potentialTable,
  clientTable,
  activityLogTable,
} from "../db/schema.js";

dotenv.config();

const clearDatabase = async () => {
  let client;

  try {
    console.log("🗑️  Starting database cleanup...\n");
    console.log("📡 Connecting to database...");

    // Create a fresh connection
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }

    // Create postgres client with SSL support for Render
    client = postgres(connectionString, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: "require",
    });

    const db = drizzle(client);

    console.log("✅ Connected to database\n");

    // Delete in order to respect foreign key constraints
    console.log("Deleting activity logs...");
    await db.delete(activityLogTable);
    console.log("✅ Activity logs deleted");

    console.log("Deleting clients...");
    await db.delete(clientTable);
    console.log("✅ Clients deleted");

    console.log("Deleting potentials...");
    await db.delete(potentialTable);
    console.log("✅ Potentials deleted");

    console.log("Deleting leads...");
    await db.delete(leadTable);
    console.log("✅ Leads deleted");

    console.log("Deleting inquiries...");
    await db.delete(inquiryTable);
    console.log("✅ Inquiries deleted");

    console.log("Deleting sessions...");
    await db.delete(sessionTable);
    console.log("✅ Sessions deleted");

    console.log("Deleting users...");
    await db.delete(userTable);
    console.log("✅ Users deleted");

    console.log("\n🎉 Database cleared successfully!");
    console.log("\n⚠️  All data has been deleted from the database.");
    console.log("💡 Run 'npm run seed:admin' to create a new admin user.\n");

    // Close connection
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing database:", error.message);

    if (error.code === "ECONNRESET") {
      console.error("\n💡 Connection was reset. This might be due to:");
      console.error("   - Database server timeout");
      console.error("   - Network issues");
      console.error("   - Database credentials in .env file");
      console.error("\n🔍 Check your DATABASE_URL in .env file");
    }

    if (client) {
      await client.end();
    }
    process.exit(1);
  }
};

clearDatabase();
