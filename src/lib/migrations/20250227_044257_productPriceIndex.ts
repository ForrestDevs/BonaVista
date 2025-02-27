import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" ADD COLUMN "price_min" numeric DEFAULT 0;
  ALTER TABLE "products" ADD COLUMN "price_max" numeric DEFAULT 0;
  ALTER TABLE "_products_v" ADD COLUMN "version_price_min" numeric DEFAULT 0;
  ALTER TABLE "_products_v" ADD COLUMN "version_price_max" numeric DEFAULT 0;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" DROP COLUMN IF EXISTS "price_min";
  ALTER TABLE "products" DROP COLUMN IF EXISTS "price_max";
  ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_price_min";
  ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_price_max";`)
}
