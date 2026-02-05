import { db } from "../db/index.js";
import { clientTable } from "../db/schema.js";
import { desc } from "drizzle-orm";

/**
 * List all clients in the database
 */
async function listAllClients() {
  try {
    console.log("📋 Listing all clients...\n");

    const clients = await db
      .select()
      .from(clientTable)
      .orderBy(desc(clientTable.createdAt));

    if (clients.length === 0) {
      console.log("ℹ️  No clients found in database");
      process.exit(0);
    }

    console.log(`Found ${clients.length} client(s):\n`);

    // Group by email to show potential duplicates
    const byEmail = {};
    for (const client of clients) {
      const email = client.email.toLowerCase().trim();
      if (!byEmail[email]) {
        byEmail[email] = [];
      }
      byEmail[email].push(client);
    }

    // Show each email group
    for (const [email, clientList] of Object.entries(byEmail)) {
      if (clientList.length > 1) {
        console.log(`⚠️  DUPLICATE EMAIL: ${email}`);
      } else {
        console.log(`✅ ${email}`);
      }

      for (const client of clientList) {
        console.log(`   ID: ${client.id}`);
        console.log(`   Company: ${client.companyName}`);
        console.log(`   Contact: ${client.contactPerson}`);
        console.log(`   Email: ${client.email}`);
        console.log(`   Status: ${client.status}`);
        console.log(`   Created: ${client.createdAt.toISOString()}`);
        console.log(``);
      }
    }

    // Summary
    const duplicateCount = Object.values(byEmail).filter(list => list.length > 1).length;
    if (duplicateCount > 0) {
      console.log(`\n❌ Found ${duplicateCount} email(s) with duplicates!`);
      console.log(`\nTo delete a duplicate, use Drizzle Studio:`);
      console.log(`  npm run db:studio`);
      console.log(`\nOr delete via SQL (replace <id> with actual ID):`);
      console.log(`  DELETE FROM client WHERE id = '<id-of-duplicate>';`);
    } else {
      console.log(`\n✅ No duplicate emails found!`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error listing clients:", error);
    process.exit(1);
  }
}

listAllClients();
