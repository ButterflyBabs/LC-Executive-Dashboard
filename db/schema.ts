import { pgTable, serial, varchar, text, timestamp, integer, boolean, pgEnum, decimal, jsonb } from "drizzle-orm/pg-core";

// Enums
export const priorityEnum = pgEnum("priority", ["low", "medium", "high", "critical"]);
export const taskStatusEnum = pgEnum("task_status", ["backlog", "today", "in_progress", "waiting", "done"]);
export const healthEnum = pgEnum("health", ["healthy", "attention", "at_risk"]);

// 12 Business Dimensions
export const dimensionsList = [
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

// Sacred Kaleidoscope LLC (Parent Entity)
export const sacredKaleidoscope = pgTable("sacred_kaleidoscope", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().default("Sacred Kaleidoscope Community LLC"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Businesses (under Sacred Kaleidoscope)
export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  llcId: integer("llc_id").references(() => sacredKaleidoscope.id).default(1),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 20 }), // Business family color
  health: healthEnum("health").default("healthy"),
  sortOrder: integer("sort_order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Business Segments (under each Business)
export const segments = pgTable("segments", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").references(() => businesses.id).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 50 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 20 }), // Segment-specific color (variation of business color)
  health: healthEnum("health").default("healthy"),
  sortOrder: integer("sort_order").default(0),
  revenueTarget: decimal("revenue_target", { precision: 12, scale: 2 }),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Segment Revenue (actuals vs targets)
export const segmentRevenue = pgTable("segment_revenue", {
  id: serial("id").primaryKey(),
  segmentId: integer("segment_id").references(() => segments.id).notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  revenueActual: decimal("revenue_actual", { precision: 12, scale: 2 }),
  revenueTarget: decimal("revenue_target", { precision: 12, scale: 2 }),
  expenses: decimal("expenses", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Segment Dimension Health (12 dimensions per segment)
export const segmentDimensions = pgTable("segment_dimensions", {
  id: serial("id").primaryKey(),
  segmentId: integer("segment_id").references(() => segments.id).notNull(),
  dimensionKey: varchar("dimension_key", { length: 50 }).notNull(), // one of the 12 dimensions
  score: integer("score").notNull(), // 0-100
  health: healthEnum("health").default("healthy"),
  notes: text("notes"),
  updatedBy: varchar("updated_by", { length: 100 }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tasks (now with segment support)
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: taskStatusEnum("status").default("backlog"),
  priority: priorityEnum("priority").default("medium"),
  
  // Hierarchical tagging
  businessId: integer("business_id").references(() => businesses.id),
  segmentId: integer("segment_id").references(() => segments.id),
  
  // 12 Dimension tagging
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
  
  // Card positioning for drag-and-drop
  boardPosition: integer("board_position").default(0),
  
  // Metadata
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Dashboard Layout (for drag-and-drop customization)
export const dashboardLayouts = pgTable("dashboard_layouts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 100 }).notNull(),
  layoutName: varchar("layout_name", { length: 100 }).default("default"),
  layoutConfig: jsonb("layout_config").notNull(), // Stores card positions, sizes, collapsed state
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Types
export type SacredKaleidoscope = typeof sacredKaleidoscope.$inferSelect;
export type Business = typeof businesses.$inferSelect;
export type Segment = typeof segments.$inferSelect;
export type SegmentRevenue = typeof segmentRevenue.$inferSelect;
export type SegmentDimension = typeof segmentDimensions.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type DashboardLayout = typeof dashboardLayouts.$inferSelect;

export type NewSacredKaleidoscope = typeof sacredKaleidoscope.$inferInsert;
export type NewBusiness = typeof businesses.$inferInsert;
export type NewSegment = typeof segments.$inferInsert;
export type NewSegmentRevenue = typeof segmentRevenue.$inferInsert;
export type NewSegmentDimension = typeof segmentDimensions.$inferInsert;
export type NewTask = typeof tasks.$inferInsert;
export type NewDashboardLayout = typeof dashboardLayouts.$inferInsert;
