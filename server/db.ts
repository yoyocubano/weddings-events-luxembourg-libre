import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  portfolioCategories,
  portfolioProjects,
  servicePackages,
  clientInquiries,
  InsertClientInquiry,
  teamMembers
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Portfolio queries
export async function getAllPortfolioCategories() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(portfolioCategories).orderBy(portfolioCategories.displayOrder);
}

export async function getPortfolioProjectsByCategory(categoryId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  if (categoryId) {
    return await db
      .select()
      .from(portfolioProjects)
      .where(eq(portfolioProjects.categoryId, categoryId))
      .orderBy(desc(portfolioProjects.featured), portfolioProjects.displayOrder);
  }
  
  return await db
    .select()
    .from(portfolioProjects)
    .orderBy(desc(portfolioProjects.featured), portfolioProjects.displayOrder);
}

export async function getFeaturedProjects(limit: number = 6) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(portfolioProjects)
    .where(eq(portfolioProjects.featured, 1))
    .orderBy(portfolioProjects.displayOrder)
    .limit(limit);
}

// Service packages queries
export async function getAllServicePackages() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(servicePackages).orderBy(servicePackages.displayOrder);
}

// Client inquiries
export async function createClientInquiry(inquiry: InsertClientInquiry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(clientInquiries).values(inquiry);
  return result;
}

export async function getAllClientInquiries() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(clientInquiries).orderBy(desc(clientInquiries.createdAt));
}

// Team members
export async function getAllTeamMembers() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(teamMembers).orderBy(teamMembers.displayOrder);
}
