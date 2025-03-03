import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE INDEX IF NOT EXISTS "products_price_min_idx" ON "products" USING btree ("price_min");
  CREATE INDEX IF NOT EXISTS "products_price_max_idx" ON "products" USING btree ("price_max");
  CREATE INDEX IF NOT EXISTS "_products_v_version_version_price_min_idx" ON "_products_v" USING btree ("version_price_min");
  CREATE INDEX IF NOT EXISTS "_products_v_version_version_price_max_idx" ON "_products_v" USING btree ("version_price_max");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "products_price_min_idx";
  DROP INDEX IF EXISTS "products_price_max_idx";
  DROP INDEX IF EXISTS "_products_v_version_version_price_min_idx";
  DROP INDEX IF EXISTS "_products_v_version_version_price_max_idx";`)
}
