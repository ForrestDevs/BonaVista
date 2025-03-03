import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "product_reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"rating" numeric NOT NULL,
  	"review" varchar NOT NULL,
  	"is_verified_purchase" boolean DEFAULT false,
  	"reviewer_id" integer,
  	"product_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "product_reviews_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  ALTER TABLE "cart_items_variant_options" RENAME TO "cart_line_items_line_item_variant_options";
  ALTER TABLE "cart_items" RENAME TO "cart_line_items";
  ALTER TABLE "orders_items_variant_options" RENAME TO "orders_line_items_line_item_variant_options";
  ALTER TABLE "orders_items" RENAME TO "orders_line_items";
  ALTER TABLE "cart_line_items" RENAME COLUMN "product_id" TO "line_item_product_id";
  ALTER TABLE "cart_line_items" RENAME COLUMN "is_variant" TO "line_item_is_variant";
  ALTER TABLE "cart_line_items" RENAME COLUMN "price" TO "line_item_price";
  ALTER TABLE "cart_line_items" RENAME COLUMN "quantity" TO "line_item_quantity";
  ALTER TABLE "cart_line_items" RENAME COLUMN "url" TO "line_item_url";
  ALTER TABLE "orders_line_items" RENAME COLUMN "product_id" TO "line_item_product_id";
  ALTER TABLE "orders_line_items" RENAME COLUMN "is_variant" TO "line_item_is_variant";
  ALTER TABLE "orders_line_items" RENAME COLUMN "price" TO "line_item_price";
  ALTER TABLE "orders_line_items" RENAME COLUMN "quantity" TO "line_item_quantity";
  ALTER TABLE "orders_line_items" RENAME COLUMN "thumbnail_id" TO "line_item_thumbnail_id";
  ALTER TABLE "orders_line_items" RENAME COLUMN "url" TO "line_item_url";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "first_name" TO "address_first_name";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "last_name" TO "address_last_name";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "company" TO "address_company";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "line_1" TO "address_line_1";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "line_2" TO "address_line_2";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "city" TO "address_city";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "country" TO "address_country";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "state" TO "address_state";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "postal_code" TO "address_postal_code";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "phone" TO "address_phone";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "email" TO "address_email";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "metadata" TO "address_metadata";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "first_name" TO "address_first_name";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "last_name" TO "address_last_name";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "company" TO "address_company";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "line_1" TO "address_line_1";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "line_2" TO "address_line_2";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "city" TO "address_city";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "country" TO "address_country";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "state" TO "address_state";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "postal_code" TO "address_postal_code";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "phone" TO "address_phone";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "email" TO "address_email";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "metadata" TO "address_metadata";
  ALTER TABLE "cart_line_items_line_item_variant_options" DROP CONSTRAINT "cart_items_variant_options_parent_id_fk";
  
  ALTER TABLE "cart_line_items" DROP CONSTRAINT "cart_items_product_id_products_id_fk";
  
  ALTER TABLE "cart_line_items" DROP CONSTRAINT "cart_items_parent_id_fk";
  
  ALTER TABLE "orders_line_items_line_item_variant_options" DROP CONSTRAINT "orders_items_variant_options_parent_id_fk";
  
  ALTER TABLE "orders_line_items" DROP CONSTRAINT "orders_items_product_id_products_id_fk";
  
  ALTER TABLE "orders_line_items" DROP CONSTRAINT "orders_items_thumbnail_id_media_id_fk";
  
  ALTER TABLE "orders_line_items" DROP CONSTRAINT "orders_items_parent_id_fk";
  
  DROP INDEX IF EXISTS "cart_items_variant_options_order_idx";
  DROP INDEX IF EXISTS "cart_items_variant_options_parent_id_idx";
  DROP INDEX IF EXISTS "cart_items_order_idx";
  DROP INDEX IF EXISTS "cart_items_parent_id_idx";
  DROP INDEX IF EXISTS "cart_items_product_idx";
  DROP INDEX IF EXISTS "orders_items_variant_options_order_idx";
  DROP INDEX IF EXISTS "orders_items_variant_options_parent_id_idx";
  DROP INDEX IF EXISTS "orders_items_order_idx";
  DROP INDEX IF EXISTS "orders_items_parent_id_idx";
  DROP INDEX IF EXISTS "orders_items_product_idx";
  DROP INDEX IF EXISTS "orders_items_thumbnail_idx";
  ALTER TABLE "cart_line_items" ADD COLUMN "line_item_sku" varchar NOT NULL;
  ALTER TABLE "cart_line_items" ADD COLUMN "line_item_thumbnail_id" integer;
  ALTER TABLE "orders_line_items" ADD COLUMN "line_item_sku" varchar NOT NULL;
  ALTER TABLE "shipping_options" ADD COLUMN "pickup_location_first_name" varchar;
  ALTER TABLE "shipping_options" ADD COLUMN "pickup_location_last_name" varchar;
  ALTER TABLE "shipping_options" ADD COLUMN "pickup_location_company" varchar;
  ALTER TABLE "shipping_options" ADD COLUMN "pickup_location_line_1" varchar;
  ALTER TABLE "shipping_options" ADD COLUMN "pickup_location_line_2" varchar;
  ALTER TABLE "shipping_options" ADD COLUMN "pickup_location_city" varchar;
  ALTER TABLE "shipping_options" ADD COLUMN "pickup_location_country" varchar;
  ALTER TABLE "shipping_options" ADD COLUMN "pickup_location_state" varchar;
  ALTER TABLE "shipping_options" ADD COLUMN "pickup_location_postal_code" varchar;
  ALTER TABLE "shipping_options" ADD COLUMN "pickup_location_phone" varchar;
  ALTER TABLE "shipping_options" ADD COLUMN "pickup_location_email" varchar;
  ALTER TABLE "shipping_options" ADD COLUMN "pickup_location_metadata" jsonb;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "product_reviews_id" integer;
  DO $$ BEGIN
   ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_reviewer_id_customers_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "product_reviews_rels" ADD CONSTRAINT "product_reviews_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_reviews"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "product_reviews_rels" ADD CONSTRAINT "product_reviews_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "product_reviews_reviewer_idx" ON "product_reviews" USING btree ("reviewer_id");
  CREATE INDEX IF NOT EXISTS "product_reviews_product_idx" ON "product_reviews" USING btree ("product_id");
  CREATE INDEX IF NOT EXISTS "product_reviews_updated_at_idx" ON "product_reviews" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "product_reviews_created_at_idx" ON "product_reviews" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "product_reviews_rels_order_idx" ON "product_reviews_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "product_reviews_rels_parent_idx" ON "product_reviews_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "product_reviews_rels_path_idx" ON "product_reviews_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "product_reviews_rels_media_id_idx" ON "product_reviews_rels" USING btree ("media_id");
  DO $$ BEGIN
   ALTER TABLE "cart_line_items_line_item_variant_options" ADD CONSTRAINT "cart_line_items_line_item_variant_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cart_line_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "cart_line_items" ADD CONSTRAINT "cart_line_items_line_item_product_id_products_id_fk" FOREIGN KEY ("line_item_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "cart_line_items" ADD CONSTRAINT "cart_line_items_line_item_thumbnail_id_media_id_fk" FOREIGN KEY ("line_item_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "cart_line_items" ADD CONSTRAINT "cart_line_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cart"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "orders_line_items_line_item_variant_options" ADD CONSTRAINT "orders_line_items_line_item_variant_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders_line_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "orders_line_items" ADD CONSTRAINT "orders_line_items_line_item_product_id_products_id_fk" FOREIGN KEY ("line_item_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "orders_line_items" ADD CONSTRAINT "orders_line_items_line_item_thumbnail_id_media_id_fk" FOREIGN KEY ("line_item_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "orders_line_items" ADD CONSTRAINT "orders_line_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_reviews_fk" FOREIGN KEY ("product_reviews_id") REFERENCES "public"."product_reviews"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "cart_line_items_line_item_variant_options_order_idx" ON "cart_line_items_line_item_variant_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "cart_line_items_line_item_variant_options_parent_id_idx" ON "cart_line_items_line_item_variant_options" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "cart_line_items_order_idx" ON "cart_line_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "cart_line_items_parent_id_idx" ON "cart_line_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "cart_line_items_line_item_line_item_product_idx" ON "cart_line_items" USING btree ("line_item_product_id");
  CREATE INDEX IF NOT EXISTS "cart_line_items_line_item_line_item_thumbnail_idx" ON "cart_line_items" USING btree ("line_item_thumbnail_id");
  CREATE INDEX IF NOT EXISTS "orders_line_items_line_item_variant_options_order_idx" ON "orders_line_items_line_item_variant_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "orders_line_items_line_item_variant_options_parent_id_idx" ON "orders_line_items_line_item_variant_options" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "orders_line_items_order_idx" ON "orders_line_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "orders_line_items_parent_id_idx" ON "orders_line_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "orders_line_items_line_item_line_item_product_idx" ON "orders_line_items" USING btree ("line_item_product_id");
  CREATE INDEX IF NOT EXISTS "orders_line_items_line_item_line_item_thumbnail_idx" ON "orders_line_items" USING btree ("line_item_thumbnail_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_product_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("product_reviews_id");
  ALTER TABLE "cart_line_items" DROP COLUMN IF EXISTS "variant_id";
  ALTER TABLE "orders_line_items" DROP COLUMN IF EXISTS "variant_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "product_reviews" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_reviews_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "product_reviews" CASCADE;
  DROP TABLE "product_reviews_rels" CASCADE;
  ALTER TABLE "cart_line_items_line_item_variant_options" RENAME TO "cart_items_variant_options";
  ALTER TABLE "cart_line_items" RENAME TO "cart_items";
  ALTER TABLE "orders_line_items_line_item_variant_options" RENAME TO "orders_items_variant_options";
  ALTER TABLE "orders_line_items" RENAME TO "orders_items";
  ALTER TABLE "cart_items" RENAME COLUMN "line_item_product_id" TO "product_id";
  ALTER TABLE "cart_items" RENAME COLUMN "line_item_is_variant" TO "is_variant";
  ALTER TABLE "cart_items" RENAME COLUMN "line_item_price" TO "price";
  ALTER TABLE "cart_items" RENAME COLUMN "line_item_quantity" TO "quantity";
  ALTER TABLE "cart_items" RENAME COLUMN "line_item_url" TO "url";
  ALTER TABLE "orders_items" RENAME COLUMN "line_item_product_id" TO "product_id";
  ALTER TABLE "orders_items" RENAME COLUMN "line_item_is_variant" TO "is_variant";
  ALTER TABLE "orders_items" RENAME COLUMN "line_item_price" TO "price";
  ALTER TABLE "orders_items" RENAME COLUMN "line_item_quantity" TO "quantity";
  ALTER TABLE "orders_items" RENAME COLUMN "line_item_url" TO "url";
  ALTER TABLE "orders_items" RENAME COLUMN "line_item_thumbnail_id" TO "thumbnail_id";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "address_company" TO "company";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "address_first_name" TO "first_name";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "address_last_name" TO "last_name";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "address_line_1" TO "line_1";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "address_line_2" TO "line_2";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "address_city" TO "city";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "address_country" TO "country";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "address_state" TO "state";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "address_postal_code" TO "postal_code";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "address_phone" TO "phone";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "address_email" TO "email";
  ALTER TABLE "customers_billing_addresses" RENAME COLUMN "address_metadata" TO "metadata";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "address_company" TO "company";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "address_first_name" TO "first_name";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "address_last_name" TO "last_name";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "address_line_1" TO "line_1";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "address_line_2" TO "line_2";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "address_city" TO "city";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "address_country" TO "country";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "address_state" TO "state";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "address_postal_code" TO "postal_code";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "address_phone" TO "phone";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "address_email" TO "email";
  ALTER TABLE "customers_shipping_addresses" RENAME COLUMN "address_metadata" TO "metadata";
  ALTER TABLE "cart_items_variant_options" DROP CONSTRAINT "cart_line_items_line_item_variant_options_parent_id_fk";
  
  ALTER TABLE "cart_items" DROP CONSTRAINT "cart_line_items_line_item_product_id_products_id_fk";
  
  ALTER TABLE "cart_items" DROP CONSTRAINT "cart_line_items_line_item_thumbnail_id_media_id_fk";
  
  ALTER TABLE "cart_items" DROP CONSTRAINT "cart_line_items_parent_id_fk";
  
  ALTER TABLE "orders_items_variant_options" DROP CONSTRAINT "orders_line_items_line_item_variant_options_parent_id_fk";
  
  ALTER TABLE "orders_items" DROP CONSTRAINT "orders_line_items_line_item_product_id_products_id_fk";
  
  ALTER TABLE "orders_items" DROP CONSTRAINT "orders_line_items_line_item_thumbnail_id_media_id_fk";
  
  ALTER TABLE "orders_items" DROP CONSTRAINT "orders_line_items_parent_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_product_reviews_fk";
  
  DROP INDEX IF EXISTS "cart_line_items_line_item_variant_options_order_idx";
  DROP INDEX IF EXISTS "cart_line_items_line_item_variant_options_parent_id_idx";
  DROP INDEX IF EXISTS "cart_line_items_order_idx";
  DROP INDEX IF EXISTS "cart_line_items_parent_id_idx";
  DROP INDEX IF EXISTS "cart_line_items_line_item_line_item_product_idx";
  DROP INDEX IF EXISTS "cart_line_items_line_item_line_item_thumbnail_idx";
  DROP INDEX IF EXISTS "orders_line_items_line_item_variant_options_order_idx";
  DROP INDEX IF EXISTS "orders_line_items_line_item_variant_options_parent_id_idx";
  DROP INDEX IF EXISTS "orders_line_items_order_idx";
  DROP INDEX IF EXISTS "orders_line_items_parent_id_idx";
  DROP INDEX IF EXISTS "orders_line_items_line_item_line_item_product_idx";
  DROP INDEX IF EXISTS "orders_line_items_line_item_line_item_thumbnail_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_product_reviews_id_idx";
  ALTER TABLE "cart_items" ADD COLUMN "variant_id" numeric;
  ALTER TABLE "orders_items" ADD COLUMN "variant_id" numeric;
  DO $$ BEGIN
   ALTER TABLE "cart_items_variant_options" ADD CONSTRAINT "cart_items_variant_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cart_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cart"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "orders_items_variant_options" ADD CONSTRAINT "orders_items_variant_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "cart_items_variant_options_order_idx" ON "cart_items_variant_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "cart_items_variant_options_parent_id_idx" ON "cart_items_variant_options" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "cart_items_order_idx" ON "cart_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "cart_items_parent_id_idx" ON "cart_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "cart_items_product_idx" ON "cart_items" USING btree ("product_id");
  CREATE INDEX IF NOT EXISTS "orders_items_variant_options_order_idx" ON "orders_items_variant_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "orders_items_variant_options_parent_id_idx" ON "orders_items_variant_options" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "orders_items_order_idx" ON "orders_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "orders_items_parent_id_idx" ON "orders_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "orders_items_product_idx" ON "orders_items" USING btree ("product_id");
  CREATE INDEX IF NOT EXISTS "orders_items_thumbnail_idx" ON "orders_items" USING btree ("thumbnail_id");
  ALTER TABLE "cart_items" DROP COLUMN IF EXISTS "line_item_sku";
  ALTER TABLE "cart_items" DROP COLUMN IF EXISTS "line_item_thumbnail_id";
  ALTER TABLE "orders_items" DROP COLUMN IF EXISTS "line_item_sku";
  ALTER TABLE "shipping_options" DROP COLUMN IF EXISTS "pickup_location_first_name";
  ALTER TABLE "shipping_options" DROP COLUMN IF EXISTS "pickup_location_last_name";
  ALTER TABLE "shipping_options" DROP COLUMN IF EXISTS "pickup_location_company";
  ALTER TABLE "shipping_options" DROP COLUMN IF EXISTS "pickup_location_line_1";
  ALTER TABLE "shipping_options" DROP COLUMN IF EXISTS "pickup_location_line_2";
  ALTER TABLE "shipping_options" DROP COLUMN IF EXISTS "pickup_location_city";
  ALTER TABLE "shipping_options" DROP COLUMN IF EXISTS "pickup_location_country";
  ALTER TABLE "shipping_options" DROP COLUMN IF EXISTS "pickup_location_state";
  ALTER TABLE "shipping_options" DROP COLUMN IF EXISTS "pickup_location_postal_code";
  ALTER TABLE "shipping_options" DROP COLUMN IF EXISTS "pickup_location_phone";
  ALTER TABLE "shipping_options" DROP COLUMN IF EXISTS "pickup_location_email";
  ALTER TABLE "shipping_options" DROP COLUMN IF EXISTS "pickup_location_metadata";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "product_reviews_id";`)
}
