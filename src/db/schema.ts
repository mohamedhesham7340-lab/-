import { relations } from 'drizzle-orm';
import { integer, boolean, pgTable, serial, text, timestamp, real, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  itemNo: text('item_no').notNull(),
  category: text('category').notNull(),
  categoryNameAr: text('category_name_ar').notNull(),
  categoryNameEn: text('category_name_en').notNull(),
  nameAr: text('name_ar').notNull(),
  nameEn: text('name_en').notNull(),
  packagingAr: text('packaging_ar').notNull(),
  packagingEn: text('packaging_en').notNull(),
  pricePerMT: real('price_per_mt').notNull(),
  fcl20: text('fcl_20').notNull(),
  fcl40: text('fcl_40').notNull(),
  imageUrl: text('image_url').notNull(),
  descriptionAr: text('description_ar').notNull(),
  descriptionEn: text('description_en').notNull(),
  inStock: boolean('in_stock').notNull().default(true),
  minOrderMT: real('min_order_mt').notNull(),
  hsCode: text('hs_code'),
  moisture: text('moisture'),
  purity: text('purity'),
  shelfLife: text('shelf_life'),
  origin: text('origin'),
});

export const quotationMeta = pgTable('quotation_meta', {
  id: serial('id').primaryKey(),
  data: jsonb('data').notNull(), // Store as JSON for flexibility or specify columns
});
