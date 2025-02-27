import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE INDEX IF NOT EXISTS "products_title_idx" ON "products" USING btree ("title");
  CREATE INDEX IF NOT EXISTS "_products_v_version_version_title_idx" ON "_products_v" USING btree ("version_title");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "products_title_idx";
  DROP INDEX IF EXISTS "_products_v_version_version_title_idx";`)
}
