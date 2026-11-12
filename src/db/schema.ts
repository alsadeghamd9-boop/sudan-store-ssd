import { pgTable, serial, varchar, text, integer, boolean, timestamp, numeric, pgEnum, index, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const orderStatusEnum = pgEnum("order_status", ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]);
export const paymentMethodEnum = pgEnum("payment_method", ["cod", "bank_transfer"]);
export const paymentStatusEnum = pgEnum("payment_status", ["unpaid", "pending_verification", "paid", "refunded"]);

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(), name: varchar("name", { length: 100 }).notNull(), slug: varchar("slug", { length: 120 }).notNull(),
  description: text("description"), imageUrl: text("image_url"), createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => [uniqueIndex("categories_slug_idx").on(t.slug)]);

export const products = pgTable("products", {
  id: serial("id").primaryKey(), name: varchar("name", { length: 180 }).notNull(), slug: varchar("slug", { length: 200 }).notNull(),
  description: text("description").notNull(), price: integer("price").notNull(), compareAtPrice: integer("compare_at_price"),
  stock: integer("stock").default(0).notNull(), imageUrl: text("image_url"), imagePublicId: varchar("image_public_id", { length: 255 }),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }), featured: boolean("featured").default(false).notNull(), active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(), updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => [uniqueIndex("products_slug_idx").on(t.slug), index("products_category_idx").on(t.categoryId), index("products_active_featured_idx").on(t.active, t.featured)]);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(), orderNumber: varchar("order_number", { length: 32 }).notNull(), customerName: varchar("customer_name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(), email: varchar("email", { length: 254 }), city: varchar("city", { length: 100 }).notNull(), address: text("address").notNull(),
  notes: text("notes"), subtotal: integer("subtotal").notNull(), shipping: integer("shipping").notNull(), total: integer("total").notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(), paymentStatus: paymentStatusEnum("payment_status").default("unpaid").notNull(),
  bankName: varchar("bank_name", { length: 100 }), orderStatus: orderStatusEnum("order_status").default("pending").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => [uniqueIndex("orders_number_idx").on(t.orderNumber), index("orders_created_idx").on(t.createdAt)]);

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(), orderId: integer("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }), productName: varchar("product_name", { length: 180 }).notNull(),
  unitPrice: integer("unit_price").notNull(), quantity: integer("quantity").notNull()
}, (t) => [index("order_items_order_idx").on(t.orderId)]);

export const categoriesRelations = relations(categories, ({ many }) => ({ products: many(products) }));
export const productsRelations = relations(products, ({ one, many }) => ({ category: one(categories, { fields: [products.categoryId], references: [categories.id] }), orderItems: many(orderItems) }));
export const ordersRelations = relations(orders, ({ many }) => ({ items: many(orderItems) }));
export const orderItemsRelations = relations(orderItems, ({ one }) => ({ order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }), product: one(products, { fields: [orderItems.productId], references: [products.id] }) }));
