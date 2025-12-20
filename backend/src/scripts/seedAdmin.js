import { db } from "../db/index.js";
import { userTable } from "../db/schema.js";
import { hashPassword } from "../auth/password.js";
import { generateIdFromEntropySize } from "lucia";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
  try {
    console.log("🌱 Seeding admin user...");

    const adminEmail = "admin@wasteph.com";
    const adminPassword = "Admin@123456"; // Change this in production!

    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, adminEmail))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log("⚠️  Admin user already exists");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await hashPassword(adminPassword);

    // Generate user ID
    const userId = generateIdFromEntropySize(10);

    // Create admin user
    const [admin] = await db
      .insert(userTable)
      .values({
        id: userId,
        email: adminEmail,
        hashedPassword,
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        isActive: true,
      })
      .returning();

    console.log("✅ Admin user created successfully!");
    console.log("\nAdmin Credentials:");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);
    console.log("\n⚠️  IMPORTANT: Change the password after first login!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
    process.exit(1);
  }
};

seedAdmin();
