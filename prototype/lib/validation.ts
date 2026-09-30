import { z } from "zod";

export const createLocationSchema = z.object({
  name: z.string().min(2).max(120),
  category: z.string().min(2).max(40).optional().default("Other"),
  address: z.string().min(3).max(200),
  description: z.string().max(1000).nullish(),
  entrance: z.string().max(500).nullish(),
  finalDirections: z.string().min(5).max(2000),
  landmarks: z.array(z.string().min(1).max(60)).max(20).optional().default([]),
  lookFor: z.string().max(500).nullish(),
  parentId: z.string().min(1).nullish(),
  level: z.enum(["estate", "block", "building", "floor", "unit", "shop", "place"]).optional(),
});

export const patchLocationSchema = z.object({
  description: z.string().max(1000).nullish(),
  entrance: z.string().max(500).nullish(),
  finalDirections: z.string().min(5).max(2000).optional(),
  lookFor: z.string().max(500).nullish(),
  landmarks: z.array(z.string().min(1).max(60)).max(20).optional(),
});

export const reparentSchema = z.object({
  parentId: z.string().min(1).nullable(),
});

export const claimSchema = z.object({
  note: z.string().max(500).nullish(),
});

export const claimDecisionSchema = z.object({
  action: z.enum(["approve", "reject"]),
});

export const correctionSchema = z.object({
  type: z.enum([
    "wrong_entrance",
    "wrong_directions",
    "wrong_photo",
    "moved",
    "blocked_road",
    "demolished",
    "wrong_landmark",
    "access_restriction",
    "other",
  ]),
  detail: z.string().min(5).max(1000),
});

export const correctionDecisionSchema = z.object({
  action: z.enum(["confirm", "dismiss"]),
  // Optional corrected values applied to the location when confirming.
  apply: patchLocationSchema.optional(),
});

export const alertSchema = z.object({
  locationId: z.string().min(1).nullish(),
  roadHint: z.string().min(3).max(200).nullish(),
  type: z.enum([
    "construction",
    "checkpoint",
    "congestion",
    "closure",
    "accident",
    "flood",
    "event",
    "diversion",
  ]),
  detail: z.string().min(5).max(1000),
  ttlHours: z.number().min(0.25).max(72).optional(),
});

export const alertDecisionSchema = z.object({
  action: z.enum(["confirm", "clear"]),
});
