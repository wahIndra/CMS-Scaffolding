import { z } from "zod";

const roleEnum = z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"]);
const statusEnum = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]);

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  role: roleEnum.default("EDITOR"),
  status: statusEnum.default("ACTIVE"),
});

export const updateUserSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/)
    .optional()
    .or(z.literal("")),
  role: roleEnum.optional(),
  status: statusEnum.optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
