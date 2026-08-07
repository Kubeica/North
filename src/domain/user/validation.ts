import { z } from "zod";

export const userRoleSchema = z.enum(["ADMIN", "EDITOR"]);

export const userCreateSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  email: z.string().trim().email("Invalid email address").max(254),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
  role: userRoleSchema.default("EDITOR"),
  active: z.boolean().default(true),
});

export const userUpdateSchema = z
  .object({
    id: z.string().cuid(),
    name: z.string().trim().min(2).max(120).optional(),
    email: z.string().trim().email().max(254).optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128)
      .optional()
      .or(z.literal(""))
      .transform((value) => (value ? value : undefined)),
    role: userRoleSchema.optional(),
    active: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).some((key) => key !== "id"), {
    message: "At least one field must be updated",
  });

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
