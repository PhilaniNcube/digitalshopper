import { relations, sql } from "drizzle-orm";
import {
	type AnyPgColumn,
	boolean,
	doublePrecision,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";

export const orderStatusEnum = pgEnum("order_status", [
	"pending",
	"paid",
	"failed",
	"cancelled",
]);

export const warehouseCodeEnum = pgEnum("warehouse_code", ["CPT", "JHB", "DBN"]);

export type StoredOrderItem = {
	id: string;
	title: string;
	price: number;
	quantity: number;
	image: string;
};

export type ProductAttributeValue = string | number | boolean | null;

export type ProductAttributes = Record<string, ProductAttributeValue>;

export type SupplierProductPayload = Record<string, unknown>;

export const user = pgTable(
	"user",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		email: text("email").notNull().unique(),
		emailVerified: boolean("email_verified").notNull().default(false),
		image: text("image"),
		role: text("role").notNull().default("user"),
		banned: boolean("banned").notNull().default(false),
		banReason: text("ban_reason"),
		banExpires: timestamp("ban_expires"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [index("user_role_idx").on(table.role)],
);

export const session = pgTable(
	"session",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		impersonatedBy: text("impersonated_by"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [index("session_user_id_idx").on(table.userId)],
);

export const account = pgTable(
	"account",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		index("account_user_id_idx").on(table.userId),
		uniqueIndex("account_provider_account_unique").on(table.providerId, table.accountId),
	],
);

export const verification = pgTable(
	"verification",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const brands = pgTable(
	"brands",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		name: text("name").notNull(),
		slug: text("slug").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [uniqueIndex("brands_name_unique").on(table.name), uniqueIndex("brands_slug_unique").on(table.slug)],
);

export const categories = pgTable(
	"categories",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		name: text("name").notNull(),
		slug: text("slug").notNull(),
		path: text("path").notNull(),
		depth: integer("depth").notNull(),
		parentId: uuid("parent_id").references((): AnyPgColumn => categories.id, {
			onDelete: "set null",
		}),
		sourcePath: text("source_path"),
		sourcePathAlt: text("source_path_alt"),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		uniqueIndex("categories_path_unique").on(table.path),
		index("categories_parent_id_idx").on(table.parentId),
		index("categories_slug_idx").on(table.slug),
	],
);

export const products = pgTable(
	"products",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		supplier: text("supplier").notNull().default("syntech"),
		supplierSku: text("supplier_sku").notNull(),
		slug: text("slug").notNull(),
		title: text("title").notNull(),
		summary: text("summary"),
		shortDescription: text("short_description"),
		descriptionHtml: text("description_html").notNull(),
		sourceUrl: text("source_url"),
		brandId: uuid("brand_id").references(() => brands.id, { onDelete: "set null" }),
		categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
		featuredImage: text("featured_image"),
		price: integer("price").notNull(),
		rrpIncl: integer("rrp_incl"),
		promoPrice: integer("promo_price"),
		recommendedMargin: doublePrecision("recommended_margin"),
		promoStartsAt: timestamp("promo_starts_at"),
		promoEndsAt: timestamp("promo_ends_at"),
		weightGrams: integer("weight_grams"),
		lengthCm: doublePrecision("length_cm"),
		widthCm: doublePrecision("width_cm"),
		heightCm: doublePrecision("height_cm"),
		ean: text("ean"),
		colour: text("colour"),
		warranty: text("warranty"),
		supplierFlags: text("supplier_flags").array().notNull().default(sql`'{}'::text[]`),
		totalStock: integer("total_stock").notNull().default(0),
		inStock: boolean("in_stock").notNull().default(false),
		nextShipmentEta: text("next_shipment_eta"),
		featured: boolean("featured").notNull().default(false),
		active: boolean("active").notNull().default(true),
		specs: jsonb("specs").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
		rawAttributes: jsonb("raw_attributes").$type<ProductAttributes>().notNull().default(sql`'{}'::jsonb`),
		rawPayload: jsonb("raw_payload").$type<SupplierProductPayload>().notNull(),
		supplierLastModified: timestamp("supplier_last_modified"),
		lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		uniqueIndex("products_supplier_sku_unique").on(table.supplier, table.supplierSku),
		uniqueIndex("products_slug_unique").on(table.slug),
		index("products_brand_id_idx").on(table.brandId),
		index("products_category_id_idx").on(table.categoryId),
		index("products_in_stock_idx").on(table.inStock),
		index("products_featured_idx").on(table.featured),
		index("products_supplier_last_modified_idx").on(table.supplierLastModified),
	],
);

export const productImages = pgTable(
	"product_images",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		productId: uuid("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		url: text("url").notNull(),
		position: integer("position").notNull().default(0),
		isPrimary: boolean("is_primary").notNull().default(false),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		index("product_images_product_id_idx").on(table.productId),
		uniqueIndex("product_images_product_position_unique").on(table.productId, table.position),
	],
);

export const productInventory = pgTable(
	"product_inventory",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		productId: uuid("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		warehouseCode: warehouseCodeEnum("warehouse_code").notNull(),
		quantity: integer("quantity").notNull().default(0),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		uniqueIndex("product_inventory_product_warehouse_unique").on(table.productId, table.warehouseCode),
		index("product_inventory_warehouse_code_idx").on(table.warehouseCode),
	],
);

export const orders = pgTable(
	"orders",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
		firstName: text("first_name").notNull(),
		lastName: text("last_name").notNull(),
		email: text("email").notNull(),
		phone: text("phone").notNull(),
		addressLine1: text("address_line_1").notNull(),
		addressLine2: text("address_line_2"),
		city: text("city").notNull(),
		province: text("province").notNull(),
		postalCode: text("postal_code").notNull(),
		items: jsonb("items").$type<StoredOrderItem[]>().notNull().default(sql`'[]'::jsonb`),
		subtotal: integer("subtotal").notNull(),
		shipping: integer("shipping").notNull().default(0),
		total: integer("total").notNull(),
		currency: text("currency").notNull().default("ZAR"),
		status: orderStatusEnum("status").notNull().default("pending"),
		payfastPaymentId: text("payfast_payment_id"),
		paidAt: timestamp("paid_at", { withTimezone: true }),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [index("orders_user_id_idx").on(table.userId), index("orders_status_idx").on(table.status)],
);

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	orders: many(orders),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

export const brandRelations = relations(brands, ({ many }) => ({
	products: many(products),
}));

export const categoryRelations = relations(categories, ({ one, many }) => ({
	parent: one(categories, {
		fields: [categories.parentId],
		references: [categories.id],
		relationName: "category_parent",
	}),
	children: many(categories, {
		relationName: "category_parent",
	}),
	products: many(products),
}));

export const productRelations = relations(products, ({ one, many }) => ({
	brand: one(brands, {
		fields: [products.brandId],
		references: [brands.id],
	}),
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id],
	}),
	images: many(productImages),
	inventory: many(productInventory),
}));

export const productImageRelations = relations(productImages, ({ one }) => ({
	product: one(products, {
		fields: [productImages.productId],
		references: [products.id],
	}),
}));

export const productInventoryRelations = relations(productInventory, ({ one }) => ({
	product: one(products, {
		fields: [productInventory.productId],
		references: [products.id],
	}),
}));

export const orderRelations = relations(orders, ({ one }) => ({
	user: one(user, {
		fields: [orders.userId],
		references: [user.id],
	}),
}));

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Verification = typeof verification.$inferSelect;
export type Brand = typeof brands.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductImage = typeof productImages.$inferSelect;
export type ProductInventory = typeof productInventory.$inferSelect;
export type Order = typeof orders.$inferSelect;