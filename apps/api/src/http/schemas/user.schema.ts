import { z } from "zod";

/** Input validation for creating a user through the HTTP layer. */
export const createUserSchema = z.object({
  id: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("A valid email is required").max(320),
  emailVerified: z.boolean().optional(),
  image: z.string().trim().min(1).nullable().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    email: z.string().trim().email().max(320).optional(),
    emailVerified: z.boolean().optional(),
    image: z.string().trim().min(1).nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const userSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().min(1).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
