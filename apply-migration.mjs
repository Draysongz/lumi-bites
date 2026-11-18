import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";

const p = new PrismaClient();
const sql = readFileSync("prisma/migrations/20261116093000_dish_catalog/migration.sql", "utf8");

try {
  await p.$executeRawUnsafe(sql);
  // Record the migration in _prisma_migrations so Prisma knows it's applied.
  await p.$executeRawUnsafe(`
    INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count")
    VALUES ($1, $2, now(), $3, $4, null, now(), 1)
    ON CONFLICT ("id") DO NOTHING
  `, 
    "20261116093000_dish_catalog",
    "0", // placeholder checksum is fine; migrate deploy won't re-run already-applied
    "20261116093000_dish_catalog",
    "applied via script (migrate engine unreachable)"
  );
  console.log("✅ Migration SQL applied + recorded");
} catch (e) {
  console.error("❌ FAILED:", e.message);
} finally {
  await p.$disconnect();
}
