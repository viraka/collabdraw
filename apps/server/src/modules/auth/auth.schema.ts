import { z } from "zod";

// ------------------------
// GUEST AUTH
// ------------------------
export const guestSchema = z.object({
  username: z.string().min(2).max(24),
});

export type GuestRequest = z.infer<typeof guestSchema>;

// ------------------------
// USER REGISTER
// ------------------------
export const registerSchema = z.object({
  username: z.string().min(2).max(24),
  password: z.string().min(8),
});

export type RegisterRequest = z.infer<typeof registerSchema>;

// ------------------------
// USER LOGIN
// ------------------------
export const loginSchema = z.object({
  username: z.string().min(2),
  password: z.string().min(8),
});

export type LoginRequest = z.infer<typeof loginSchema>;
