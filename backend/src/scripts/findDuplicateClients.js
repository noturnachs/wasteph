import { db } from "../db/index.js";
import { clientTable } from "../db/schema.js";
import { sql } from "drizzle-orm";

/**
 * Find duplicate clients by email
 * This script helps identify clients with the same email address
 */
async function findDuplicateClients() {
  try {
    console.log("🔍 Searching for duplicate clients by email...\n");

    // Find emails that appear more than once
    const duplicates = await db.execute(sql`
      SELECT 
        LOWER(TRIM(email)) as normalized_email,
        COUNT(*) as count,
        ARRAY_AGG(id) as client_ids,
        ARRAY_AGG(company_name) as company_names,
        ARRAY_AGG(created_at ORDER BY created_at) as created_dates
      FROM client
      GROUP BY LOWER(TRIM(email))
      HAVING COUNT(*) > 1
      ORDER BY COUNT(*) DESC
    `);

    // Handle different response formats
    const results = Array.isArray(duplicates) ? duplicates : (duplicates.rows || []);

    if (results.length === 0) {
      console.log("✅ No duplicate clients found!");
      process.exit(0);
    }

    console.log(`❌ Found ${results.length} email(s) with duplicates:\n`);

    for (const dup of results) {
      console.log(`📧 Email: ${dup.normalized_email}`);
      console.log(`   Count: ${dup.count} duplicates`);
      console.log(`   Client IDs: ${dup.client_ids.join(", ")}`);
      console.log(`   Company Names: ${dup.company_names.join(", ")}`);
      console.log(`   Created Dates: ${dup.created_dates.map(d => new Date(d).toISOString()).join(", ")}`);
      console.log("");
    }

    console.log("\n📝 To fix duplicates, you can:");
    console.log("1. Manually delete duplicate records from the database");
    console.log("2. Update contracts to point to the correct client_id");
    console.log("3. Run: npm run db:studio to view and edit records\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error finding duplicates:", error);
    process.exit(1);
  }
}

findDuplicateClients();
