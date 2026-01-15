import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    username: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    karma: v.number(),
    reviewCount: v.number(),
    helpfulVotes: v.number(),
    isDeleted: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_karma", ["karma"]),

  discussions: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    category: v.union(
      v.literal("general"),
      v.literal("question"),
      v.literal("news"),
      v.literal("deal"),
      v.literal("showcase"),
      v.literal("help")
    ),
    upvotes: v.number(),
    downvotes: v.number(),
    score: v.number(),
    hotScore: v.number(),
    commentCount: v.number(),
    isPinned: v.boolean(),
    isLocked: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_category", ["category"])
    .index("by_hotScore", ["hotScore"])
    .index("by_createdAt", ["createdAt"]),

  discussionVotes: defineTable({
    discussionId: v.id("discussions"),
    userId: v.id("users"),
    value: v.number(),
    createdAt: v.number(),
  })
    .index("by_discussion_user", ["discussionId", "userId"])
    .index("by_userId", ["userId"]),

  userReviews: defineTable({
    userId: v.id("users"),
    productSlug: v.string(),
    title: v.string(),
    content: v.string(),
    rating: v.number(),
    pros: v.array(v.string()),
    cons: v.array(v.string()),
    ownershipDuration: v.optional(v.string()),
    verifiedPurchase: v.boolean(),
    helpfulCount: v.number(),
    notHelpfulCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_productSlug", ["productSlug"])
    .index("by_rating", ["rating"]),

  reviewVotes: defineTable({
    reviewId: v.id("userReviews"),
    userId: v.id("users"),
    isHelpful: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_review_user", ["reviewId", "userId"])
    .index("by_userId", ["userId"]),

  comments: defineTable({
    userId: v.id("users"),
    reviewId: v.optional(v.id("userReviews")),
    discussionId: v.optional(v.id("discussions")),
    parentId: v.optional(v.id("comments")),
    content: v.string(),
    upvotes: v.number(),
    downvotes: v.number(),
    isDeleted: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_reviewId", ["reviewId"])
    .index("by_discussionId", ["discussionId"])
    .index("by_parentId", ["parentId"])
    .index("by_userId", ["userId"]),

  commentVotes: defineTable({
    commentId: v.id("comments"),
    userId: v.id("users"),
    value: v.number(),
    createdAt: v.number(),
  })
    .index("by_comment_user", ["commentId", "userId"])
    .index("by_userId", ["userId"]),

  bookmarks: defineTable({
    userId: v.id("users"),
    productSlug: v.string(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_user_product", ["userId", "productSlug"]),

  badges: defineTable({
    name: v.string(),
    description: v.string(),
    icon: v.string(),
    color: v.string(),
    requirement: v.string(),
    threshold: v.number(),
    createdAt: v.number(),
  }).index("by_name", ["name"]),

  userBadges: defineTable({
    userId: v.id("users"),
    badgeId: v.id("badges"),
    awardedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_user_badge", ["userId", "badgeId"]),
});
