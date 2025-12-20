import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const resetDatabase = async () => {
  let client;

  try {
    console.log("🔄 Starting database reset...\n");
    console.log("📡 Connecting to database...");

    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }

    // Create postgres client with SSL support
    client = postgres(connectionString, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: "require",
    });

    console.log("✅ Connected to database\n");

    console.log("🗑️  Dropping all tables...");

    // Drop all tables in the correct order (reverse of foreign key dependencies)
    await client`DROP TABLE IF EXISTS activity_log CASCADE`;
    console.log("  ✅ Dropped activity_log");

    await client`DROP TABLE IF EXISTS client CASCADE`;
    console.log("  ✅ Dropped client");

    await client`DROP TABLE IF EXISTS potential CASCADE`;
    console.log("  ✅ Dropped potential");

    await client`DROP TABLE IF EXISTS lead CASCADE`;
    console.log("  ✅ Dropped lead");

    await client`DROP TABLE IF EXISTS inquiry CASCADE`;
    console.log("  ✅ Dropped inquiry");

    await client`DROP TABLE IF EXISTS session CASCADE`;
    console.log("  ✅ Dropped session");

    await client`DROP TABLE IF EXISTS "user" CASCADE`;
    console.log("  ✅ Dropped user");

    // Drop enums
    await client`DROP TYPE IF EXISTS user_role CASCADE`;
    console.log("  ✅ Dropped user_role enum");

    await client`DROP TYPE IF EXISTS inquiry_status CASCADE`;
    console.log("  ✅ Dropped inquiry_status enum");

    await client`DROP TYPE IF EXISTS lead_status CASCADE`;
    console.log("  ✅ Dropped lead_status enum");

    await client`DROP TYPE IF EXISTS client_status CASCADE`;
    console.log("  ✅ Dropped client_status enum");

    console.log("\n🎉 Database reset successfully!");
    console.log("\n📋 Next steps:");
    console.log("   1. Run 'npm run db:push' to create fresh tables");
    console.log("   2. Run 'npm run seed:admin' to create admin user\n");

    // Close connection
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error resetting database:", error.message);

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

resetDatabase();
