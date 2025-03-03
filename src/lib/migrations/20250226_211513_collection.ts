import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "store_hours_days" ALTER COLUMN "opentime_tz" SET DEFAULT 'America/New_York';
  ALTER TABLE "store_hours_days" ALTER COLUMN "closetime_tz" SET DEFAULT 'America/New_York';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "store_hours_days" ALTER COLUMN "opentime_tz" SET DEFAULT 'America/Toronto';
  ALTER TABLE "store_hours_days" ALTER COLUMN "closetime_tz" SET DEFAULT 'America/Toronto';`)
}
