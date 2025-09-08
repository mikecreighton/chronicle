import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    // Ordered by the custom "order" field via index
    const books = await ctx.db
      .query("books")
      .withIndex("by_order")
      .order("asc")
      .collect();
    return books;
  },
});

export const add = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, { title }) => {
    const last = await ctx.db
      .query("books")
      .withIndex("by_order")
      .order("desc")
      .first();
    const nextOrder = last ? last.order + 1 : 1;
    const id = await ctx.db.insert("books", {
      title,
      status: "planned",
      order: nextOrder,
    });
    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("books"),
    title: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("planned"), v.literal("reading"), v.literal("completed"))
    ),
    order: v.optional(v.number()),
  },
  handler: async (ctx, { id, title, status, order }) => {
    const current = await ctx.db.get(id);
    if (!current) return;

    const patch: Record<string, unknown> = {};
    if (title !== undefined) patch.title = title;
    if (order !== undefined) patch.order = order;
    if (status !== undefined) {
      patch.status = status;
      const now = Date.now();
      if (status === "reading" && current.startedAt === undefined) {
        patch.startedAt = now;
      }
      if (status === "completed") {
        patch.completedAt = now;
        if (current.startedAt === undefined) patch.startedAt = now;
      }
      if (status === "planned") {
        patch.startedAt = undefined;
        patch.completedAt = undefined;
      }
    }

    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("books") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const reorder = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("books"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, { updates }) => {
    for (const { id, order } of updates) {
      await ctx.db.patch(id, { order });
    }
  },
});

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const allBooks = await ctx.db.query("books").collect();
    for (const book of allBooks) {
      await ctx.db.delete(book._id);
    }
  },
});
