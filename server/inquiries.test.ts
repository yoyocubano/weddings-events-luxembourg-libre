import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the notification function
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createTestContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("inquiries.create", () => {
  it("creates a new client inquiry with required fields", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.inquiries.create({
      name: "John Doe",
      email: "john@example.com",
      eventType: "wedding",
    });

    expect(result).toEqual({ success: true });
  });

  it("creates inquiry with all optional fields", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const eventDate = new Date("2025-06-15");

    const result = await caller.inquiries.create({
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+352 123 456 789",
      eventType: "corporate",
      eventDate: eventDate,
      location: "Luxembourg City",
      budget: "5000-10000",
      guestCount: 150,
      serviceInterest: "both",
      message: "Looking for full day coverage",
    });

    expect(result).toEqual({ success: true });
  });

  it("validates required name field", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.inquiries.create({
        name: "",
        email: "test@example.com",
        eventType: "wedding",
      })
    ).rejects.toThrow();
  });

  it("validates email format", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.inquiries.create({
        name: "Test User",
        email: "invalid-email",
        eventType: "wedding",
      })
    ).rejects.toThrow();
  });

  it("validates required event type", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.inquiries.create({
        name: "Test User",
        email: "test@example.com",
        eventType: "",
      })
    ).rejects.toThrow();
  });
});
