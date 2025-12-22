import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getAllPortfolioCategories,
  getPortfolioProjectsByCategory,
  getFeaturedProjects,
  getAllServicePackages,
  createClientInquiry,
  getAllTeamMembers,
} from "./db";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  portfolio: router({
    getCategories: publicProcedure.query(async () => {
      return await getAllPortfolioCategories();
    }),
    
    getProjects: publicProcedure
      .input(z.object({
        categoryId: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await getPortfolioProjectsByCategory(input?.categoryId);
      }),
    
    getFeatured: publicProcedure
      .input(z.object({
        limit: z.number().default(6),
      }).optional())
      .query(async ({ input }) => {
        return await getFeaturedProjects(input?.limit || 6);
      }),
  }),

  services: router({
    getAll: publicProcedure.query(async () => {
      return await getAllServicePackages();
    }),
  }),

  team: router({
    getAll: publicProcedure.query(async () => {
      return await getAllTeamMembers();
    }),
  }),

  inquiries: router({
    create: publicProcedure
      .input(z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Valid email is required"),
        phone: z.string().optional(),
        eventType: z.string().min(1, "Event type is required"),
        eventDate: z.date().optional(),
        location: z.string().optional(),
        budget: z.string().optional(),
        guestCount: z.number().optional(),
        serviceInterest: z.string().optional(),
        message: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await createClientInquiry({
          ...input,
          eventDate: input.eventDate || null,
          phone: input.phone || null,
          location: input.location || null,
          budget: input.budget || null,
          guestCount: input.guestCount || null,
          serviceInterest: input.serviceInterest || null,
          message: input.message || null,
        });

        // Send notification to owner
        const notificationContent = `
New inquiry from ${input.name}
Email: ${input.email}
${input.phone ? `Phone: ${input.phone}` : ''}
Event Type: ${input.eventType}
${input.eventDate ? `Event Date: ${input.eventDate.toLocaleDateString()}` : ''}
${input.location ? `Location: ${input.location}` : ''}
${input.budget ? `Budget: ${input.budget}` : ''}
${input.serviceInterest ? `Service Interest: ${input.serviceInterest}` : ''}
${input.message ? `Message: ${input.message}` : ''}
        `.trim();

        await notifyOwner({
          title: `New Client Inquiry - ${input.eventType}`,
          content: notificationContent,
        });

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
