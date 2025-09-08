import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  // Demo table from the quickstart (kept to avoid breaking example routes)
  numbers: defineTable({
    value: v.number(),
  }),

  // Chronicle: list of books with simple status workflow
  books: defineTable({
    title: v.string(),
    status: v.union(
      v.literal("planned"),
      v.literal("reading"),
      v.literal("completed"),
    ),
    order: v.number(),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
  }).index("by_order", ["order"]),

  // Chronicle: app settings (single-user for prototype)
  settings: defineTable({
    userId: v.string(),
    yearGoal: v.number(),
    schoolYear: v.string(),
  }).index("by_user", ["userId"]),
});
