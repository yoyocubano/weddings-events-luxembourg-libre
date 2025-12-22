import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Portfolio categories (Weddings, Corporate Events, Celebrations)
 */
export const portfolioCategories = mysqlTable("portfolio_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PortfolioCategory = typeof portfolioCategories.$inferSelect;
export type InsertPortfolioCategory = typeof portfolioCategories.$inferInsert;

/**
 * Portfolio projects with images
 */
export const portfolioProjects = mysqlTable("portfolio_projects", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 200 }),
  eventDate: timestamp("eventDate"),
  coverImageUrl: text("coverImageUrl").notNull(),
  imageUrls: text("imageUrls").notNull(), // JSON array of image URLs
  featured: int("featured").default(0).notNull(), // 0 or 1 for boolean
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PortfolioProject = typeof portfolioProjects.$inferSelect;
export type InsertPortfolioProject = typeof portfolioProjects.$inferInsert;

/**
 * Service packages (Photography, Video, Full Coverage)
 */
export const servicePackages = mysqlTable("service_packages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  description: text("description").notNull(),
  features: text("features").notNull(), // JSON array of features
  price: decimal("price", { precision: 10, scale: 2 }),
  priceLabel: varchar("priceLabel", { length: 100 }), // e.g., "Starting from", "Custom quote"
  popular: int("popular").default(0).notNull(), // 0 or 1 for boolean
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ServicePackage = typeof servicePackages.$inferSelect;
export type InsertServicePackage = typeof servicePackages.$inferInsert;

/**
 * Client inquiries/consultations
 */
export const clientInquiries = mysqlTable("client_inquiries", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  eventType: varchar("eventType", { length: 100 }).notNull(), // Wedding, Corporate, Celebration, etc.
  eventDate: timestamp("eventDate"),
  location: varchar("location", { length: 300 }),
  budget: varchar("budget", { length: 100 }),
  guestCount: int("guestCount"),
  serviceInterest: varchar("serviceInterest", { length: 200 }), // Photography, Video, Both
  message: text("message"),
  status: mysqlEnum("status", ["new", "contacted", "quoted", "booked", "completed", "cancelled"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientInquiry = typeof clientInquiries.$inferSelect;
export type InsertClientInquiry = typeof clientInquiries.$inferInsert;

/**
 * Team members
 */
export const teamMembers = mysqlTable("team_members", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  role: varchar("role", { length: 150 }).notNull(),
  bio: text("bio"),
  imageUrl: text("imageUrl"),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;
