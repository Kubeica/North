import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  email: z.string().trim().email("Invalid email address").max(254),
  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),
  company: z
    .string()
    .trim()
    .max(160)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),
  subject: z.string().trim().min(2, "Subject is required").max(200),
  message: z.string().trim().min(10, "Message is too short").max(5000),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
