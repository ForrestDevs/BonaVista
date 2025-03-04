import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_orders_delivery_type" AS ENUM('pickup', 'shipping');
  ALTER TABLE "orders" RENAME COLUMN "shipping_rate_display_name" TO "shipping_details_title";
  ALTER TABLE "orders" RENAME COLUMN "shipping_rate_rate" TO "shipping_total";
  ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'processing';
  ALTER TABLE "orders" ADD COLUMN "delivery_type" "enum_orders_delivery_type" DEFAULT 'pickup';
  ALTER TABLE "orders" ADD COLUMN "shipping_details_description" varchar;
  ALTER TABLE "orders" ADD COLUMN "shipping_details_ship_to_first_name" varchar;
  ALTER TABLE "orders" ADD COLUMN "shipping_details_ship_to_last_name" varchar;
  ALTER TABLE "orders" ADD COLUMN "shipping_details_ship_to_company" varchar;
  ALTER TABLE "orders" ADD COLUMN "shipping_details_ship_to_line_1" varchar;
  ALTER TABLE "orders" ADD COLUMN "shipping_details_ship_to_line_2" varchar;
  ALTER TABLE "orders" ADD COLUMN "shipping_details_ship_to_city" varchar;
  ALTER TABLE "orders" ADD COLUMN "shipping_details_ship_to_country" varchar;
  ALTER TABLE "orders" ADD COLUMN "shipping_details_ship_to_state" varchar;
  ALTER TABLE "orders" ADD COLUMN "shipping_details_ship_to_postal_code" varchar;
  ALTER TABLE "orders" ADD COLUMN "shipping_details_ship_to_phone" varchar;
  ALTER TABLE "orders" ADD COLUMN "shipping_details_ship_to_email" varchar;
  ALTER TABLE "orders" ADD COLUMN "shipping_details_ship_to_metadata" jsonb;
  ALTER TABLE "orders" ADD COLUMN "subtotal" numeric NOT NULL;
  ALTER TABLE "customers" ADD COLUMN "first_name" varchar;
  ALTER TABLE "customers" ADD COLUMN "last_name" varchar;
  ALTER TABLE "customers" ADD COLUMN "phone" varchar;
  ALTER TABLE "users" DROP COLUMN IF EXISTS "first_name";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "last_name";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "phone";
  ALTER TABLE "public"."orders" ALTER COLUMN "status" SET DATA TYPE text;
  DROP TYPE "public"."enum_orders_status" CASCADE;
  CREATE TYPE "public"."enum_orders_status" AS ENUM('processing', 'ready_for_pickup', 'shipped', 'succeeded', 'canceled');
  ALTER TABLE "public"."orders" ALTER COLUMN "status" SET DATA TYPE "public"."enum_orders_status" USING "status"::"public"."enum_orders_status";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders" RENAME COLUMN "shipping_details_title" TO "shipping_rate_display_name";
  ALTER TABLE "orders" RENAME COLUMN "shipping_total" TO "shipping_rate_rate";
  ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'requires_action';
  ALTER TABLE "users" ADD COLUMN "first_name" varchar;
  ALTER TABLE "users" ADD COLUMN "last_name" varchar;
  ALTER TABLE "users" ADD COLUMN "phone" varchar;
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "delivery_type";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "shipping_details_description";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "shipping_details_ship_to_first_name";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "shipping_details_ship_to_last_name";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "shipping_details_ship_to_company";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "shipping_details_ship_to_line_1";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "shipping_details_ship_to_line_2";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "shipping_details_ship_to_city";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "shipping_details_ship_to_country";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "shipping_details_ship_to_state";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "shipping_details_ship_to_postal_code";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "shipping_details_ship_to_phone";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "shipping_details_ship_to_email";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "shipping_details_ship_to_metadata";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "subtotal";
  ALTER TABLE "customers" DROP COLUMN IF EXISTS "first_name";
  ALTER TABLE "customers" DROP COLUMN IF EXISTS "last_name";
  ALTER TABLE "customers" DROP COLUMN IF EXISTS "phone";
  ALTER TABLE "public"."orders" ALTER COLUMN "status" SET DATA TYPE text;
  DROP TYPE "public"."enum_orders_status";
  CREATE TYPE "public"."enum_orders_status" AS ENUM('canceled', 'processing', 'requires_action', 'requires_capture', 'requires_confirmation', 'requires_payment_method', 'succeeded');
  ALTER TABLE "public"."orders" ALTER COLUMN "status" SET DATA TYPE "public"."enum_orders_status" USING "status"::"public"."enum_orders_status";
  DROP TYPE "public"."enum_orders_delivery_type";`)
}
