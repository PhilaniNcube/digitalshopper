import { randomUUID } from "node:crypto";
import { relations, sql } from "drizzle-orm";
import {
	AnySQLiteColumn,
	check,
	index,
	integer,
	real,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";

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

export const user = sqliteTable(
	"user",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		email: text("email").notNull().unique(),
		emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
		image: text("image"),
		role: text("role").notNull().default("user"),
		banned: integer("banned", { mode: "boolean" }).notNull().default(false),
		banReason: text("ban_reason"),
		banExpires: integer("ban_expires", { mode: "timestamp" }),
		createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`)
			.$onUpdate(() => new Date()),
	},
	(table) => [index("user_role_idx").on(table.role)],
);

export const session = sqliteTable(
	"session",
	{
		id: text("id").primaryKey(),
		expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
		token: text("token").notNull().unique(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		impersonatedBy: text("impersonated_by"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`)
			.$onUpdate(() => new Date()),
	},
	(table) => [index("session_user_id_idx").on(table.userId)],
);

export const account = sqliteTable(
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
		accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
		refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
		scope: text("scope"),
		password: text("password"),
		createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`)
			.$onUpdate(() => new Date()),
	},
	(table) => [
		index("account_user_id_idx").on(table.userId),
		uniqueIndex("account_provider_account_unique").on(table.providerId, table.accountId),
	],
);

export const verification = sqliteTable(
	"verification",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
		createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`)
			.$onUpdate(() => new Date()),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const brands = sqliteTable(
	"brands",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => randomUUID()),
		name: text("name").notNull(),
		slug: text("slug").notNull(),
		createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`)
			.$onUpdate(() => new Date()),
	},
	(table) => [uniqueIndex("brands_name_unique").on(table.name), uniqueIndex("brands_slug_unique").on(table.slug)],
);

export const categories = sqliteTable(
	"categories",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => randomUUID()),
		name: text("name").notNull(),
		slug: text("slug").notNull(),
		path: text("path").notNull(),
		depth: integer("depth").notNull(),
		parentId: text("parent_id").references((): AnySQLiteColumn => categories.id, {
			onDelete: "set null",
		}),
		sourcePath: text("source_path"),
		sourcePathAlt: text("source_path_alt"),
		createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`)
			.$onUpdate(() => new Date()),
	},
	(table) => [
		uniqueIndex("categories_path_unique").on(table.path),
		index("categories_parent_id_idx").on(table.parentId),
		index("categories_slug_idx").on(table.slug),
	],
);

export const products = sqliteTable(
	"products",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => randomUUID()),
		supplier: text("supplier").notNull().default("syntech"),
		supplierSku: text("supplier_sku").notNull(),
		slug: text("slug").notNull(),
		title: text("title").notNull(),
		summary: text("summary"),
		shortDescription: text("short_description"),
		descriptionHtml: text("description_html").notNull(),
		sourceUrl: text("source_url"),
		brandId: text("brand_id").references(() => brands.id, { onDelete: "set null" }),
		categoryId: text("category_id").references(() => categories.id, { onDelete: "set null" }),
		featuredImage: text("featured_image"),
		price: integer("price").notNull(),
		rrpIncl: integer("rrp_incl"),
		promoPrice: integer("promo_price"),
		recommendedMargin: real("recommended_margin"),
		promoStartsAt: integer("promo_starts_at", { mode: "timestamp" }),
		promoEndsAt: integer("promo_ends_at", { mode: "timestamp" }),
		weightGrams: integer("weight_grams"),
		lengthCm: real("length_cm"),
		widthCm: real("width_cm"),
		heightCm: real("height_cm"),
		ean: text("ean"),
		colour: text("colour"),
		warranty: text("warranty"),
		supplierFlags: text("supplier_flags", { mode: "json" })
			.$type<string[]>()
			.notNull()
			.default([]),
		totalStock: integer("total_stock").notNull().default(0),
		inStock: integer("in_stock", { mode: "boolean" }).notNull().default(false),
		nextShipmentEta: text("next_shipment_eta"),
		featured: integer("featured", { mode: "boolean" }).notNull().default(false),
		active: integer("active", { mode: "boolean" }).notNull().default(true),
		specs: text("specs", { mode: "json" }).$type<string[]>().notNull().default([]),
		rawAttributes: text("raw_attributes", { mode: "json" })
			.$type<ProductAttributes>()
			.notNull()
			.default({}),
		rawPayload: text("raw_payload", { mode: "json" }).$type<SupplierProductPayload>().notNull(),
		supplierLastModified: integer("supplier_last_modified", { mode: "timestamp" }),
		lastSyncedAt: integer("last_synced_at", { mode: "timestamp" }),
		createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`)
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

export const productImages = sqliteTable(
	"product_images",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => randomUUID()),
		productId: text("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		url: text("url").notNull(),
		position: integer("position").notNull().default(0),
		isPrimary: integer("is_primary", { mode: "boolean" }).notNull().default(false),
		createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
	},
	(table) => [
		index("product_images_product_id_idx").on(table.productId),
		uniqueIndex("product_images_product_position_unique").on(table.productId, table.position),
	],
);

export const productInventory = sqliteTable(
	"product_inventory",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => randomUUID()),
		productId: text("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		warehouseCode: text("warehouse_code").$type<"CPT" | "JHB" | "DBN">().notNull(),
		quantity: integer("quantity").notNull().default(0),
		createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`)
			.$onUpdate(() => new Date()),
	},
	(table) => [
		uniqueIndex("product_inventory_product_warehouse_unique").on(table.productId, table.warehouseCode),
		index("product_inventory_warehouse_code_idx").on(table.warehouseCode),
		check("warehouse_code_check", sql`${table.warehouseCode} IN ('CPT', 'JHB', 'DBN')`),
	],
);

export const orders = sqliteTable(
	"orders",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => randomUUID()),
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
		items: text("items", { mode: "json" }).$type<StoredOrderItem[]>().notNull().default([]),
		subtotal: integer("subtotal").notNull(),
		shipping: integer("shipping").notNull().default(0),
		total: integer("total").notNull(),
		currency: text("currency").notNull().default("ZAR"),
		status: text("status").$type<"pending" | "paid" | "failed" | "cancelled">().notNull().default("pending"),
		payfastPaymentId: text("payfast_payment_id"),
		paidAt: integer("paid_at", { mode: "timestamp" }),
		createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`)
			.$onUpdate(() => new Date()),
	},
	(table) => [
		index("orders_user_id_idx").on(table.userId),
		index("orders_status_idx").on(table.status),
		check("order_status_check", sql`${table.status} IN ('pending', 'paid', 'failed', 'cancelled')`),
	],
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
