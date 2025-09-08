import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function getDefaultUserId(subject?: string | null): string {
  return subject ?? "default";
}

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    const subject = (await ctx.auth.getUserIdentity())?.subject ?? null;
    const userId = getDefaultUserId(subject);
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    return settings ?? null;
  },
});

export const upsertSettings = mutation({
  args: {
    yearGoal: v.number(),
    schoolYear: v.string(),
  },
  handler: async (ctx, { yearGoal, schoolYear }) => {
    const subject = (await ctx.auth.getUserIdentity())?.subject ?? null;
    const userId = getDefaultUserId(subject);

    const existing = await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { yearGoal, schoolYear });
      return existing._id;
    }
    const id = await ctx.db.insert("settings", { userId, yearGoal, schoolYear });
    return id;
  },
});

