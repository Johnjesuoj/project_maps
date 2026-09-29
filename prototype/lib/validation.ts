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
});

export const patchLocationSchema = z.object({
  description: z.string().max(1000).nullish(),
  entrance: z.string().max(500).nullish(),
  finalDirections: z.string().min(5).max(2000).optional(),
  lookFor: z.string().max(500).nullish(),
  landmarks: z.array(z.string().min(1).max(60)).max(20).optional(),
});
