import { z } from "zod";

export const messageStatusSchema = z.enum(["UNREAD", "READ", "ARCHIVED"]);

export type MessageStatusValue = z.infer<typeof messageStatusSchema>;

export const messageCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(160).optional(),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(5000),
});

export type MessageCreateInput = z.infer<typeof messageCreateSchema>;
