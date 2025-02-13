import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "public"."store_hours_days" ALTER COLUMN "day_of_week" SET DATA TYPE text;
  DROP TYPE "public"."enum_store_hours_days_day_of_week";
  CREATE TYPE "public"."enum_store_hours_days_day_of_week" AS ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
  ALTER TABLE "public"."store_hours_days" ALTER COLUMN "day_of_week" SET DATA TYPE "public"."enum_store_hours_days_day_of_week" USING "day_of_week"::"public"."enum_store_hours_days_day_of_week";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "public"."store_hours_days" ALTER COLUMN "day_of_week" SET DATA TYPE text;
  DROP TYPE "public"."enum_store_hours_days_day_of_week";
  CREATE TYPE "public"."enum_store_hours_days_day_of_week" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  ALTER TABLE "public"."store_hours_days" ALTER COLUMN "day_of_week" SET DATA TYPE "public"."enum_store_hours_days_day_of_week" USING "day_of_week"::"public"."enum_store_hours_days_day_of_week";`)
}
