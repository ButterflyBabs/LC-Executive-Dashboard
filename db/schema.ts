import { pgTable, serial, varchar, text, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";

// Enums
export const priorityEnum = pgEnum("priority", ["low", "medium", "high", "critical"]);
export const taskStatusEnum = pgEnum("task_status", ["backlog", "today", "in_progress", "waiting", "done"]);
export const businessHealthEnum = pgEnum("business_health", ["healthy", "attention", "at_risk"]);

// 12 Business Dimensions
export const dimensions = [
  "marketing",
  "sales", 
  "operations",
  "finance",
  "team",
  "systems",
  "leadership",
  "vision",
  "product",
  "customer_experience",
  "legal",
  "sustainability"
] as const;

// Businesses
export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 20 }),
  health: businessHealthEnum("health").default("healthy"),
  revenue: integer("revenue"),
  expenses: integer("expenses"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tasks with Business + Dimension Tagging
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: taskStatusEnum("status").default("backlog"),
  priority: priorityEnum("priority").default("medium"),
  
  // Business tagging
  businessId: integer("business_id").references(() => businesses.id),
  
  // 12 Dimension tagging (can have multiple)
  dimensionMarketing: boolean("dimension_marketing").default(false),
  dimensionSales: boolean("dimension_sales").default(false),
  dimensionOperations: boolean("dimension_operations").default(false),
  dimensionFinance: boolean("dimension_finance").default(false),
  dimensionTeam: boolean("dimension_team").default(false),
  dimensionSystems: boolean("dimension_systems").default(false),
  dimensionLeadership: boolean("dimension_leadership").default(false),
  dimensionVision: boolean("dimension_vision").default(false),
  dimensionProduct: boolean("dimension_product").default(false),
  dimensionCustomerExperience: boolean("dimension_customer_experience").default(false),
  dimensionLegal: boolean("dimension_legal").default(false),
  dimensionSustainability: boolean("dimension_sustainability").default(false),
  
  // Metadata
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Dimension Health Scores
export const dimensionHealth = pgTable("dimension_health", {
  id: serial("id").primaryKey(),
  dimension: varchar("dimension", { length: 50 }).notNull(),
  businessId: integer("business_id").references(() => businesses.id),
  score: integer("score").notNull(), // 0-100
  health: businessHealthEnum("health").default("healthy"),
  notes: text("notes"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Types
export type Business = typeof businesses.$inferSelect;
export type NewBusiness = typeof businesses.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type DimensionHealth = typeof dimensionHealth.$inferSelect;
export type NewDimensionHealth = typeof dimensionHealth.$inferInsert;
