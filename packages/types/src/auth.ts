import { z } from "zod";

// Zod schemas (for validation)
export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// TypeScript types (inferred from Zod)
export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;

// Response types
export interface AuthUser {
  userId: string;
  email: string;
  username: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterResponse {
  userId: string;
  email: string;
  username: string;
}
