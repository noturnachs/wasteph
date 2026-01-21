import { db } from "../../db/index.js";
import { sql } from "drizzle-orm";

/**
 * Migration: Add default_template_id to service table
 * This links services directly to their default proposal templates
 */
const addDefaultTemplateToService = async () => {
  try {
    console.log("🔄 Running migration: Add default_template_id to service table...");

    // Add the column
    await db.execute(sql`
      ALTER TABLE service
      ADD COLUMN IF NOT EXISTS default_template_id UUID
      REFERENCES proposal_template(id)
    `);

    console.log("✅ Migration completed successfully!");
    console.log("ℹ️  Next step: Run seed script to link existing services to templates");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

addDefaultTemplateToService();
