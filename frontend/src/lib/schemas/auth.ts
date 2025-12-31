/**
 * Authentication Zod Schemas
 *
 * Validates authentication API responses:
 * - Login
 * - User profile
 * - Token validation
 * - Password operations
 *
 * Created as part of Sprint 6 - Frontend Type Safety + SEO
 */

import { z } from 'zod';

/**
 * Organization schema (minimal)
 */
export const OrganizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  subdomain: z.string().min(1),
});

export type Organization = z.infer<typeof OrganizationSchema>;

/**
 * User schema - validates user object from API
 */
export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(1),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  type: z.enum(['internal', 'external', 'admin', 'superuser']),
  status: z.enum(['active', 'inactive', 'pending', 'blocked']),
  must_change_password: z.boolean().optional(),
  phone: z.string().optional(),
  cpf: z.string().optional(),
  avatar: z.string().url().nullable().optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  profile_complete: z.boolean().optional(),
});

export type User = z.infer<typeof UserSchema>;

/**
 * Login response schema
 */
export const LoginResponseSchema = z.object({
  user: UserSchema,
  token: z.string().min(1),
  organization: OrganizationSchema.nullable().optional(),
  expires_at: z.string().datetime(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

/**
 * Login request schema
 */
export const LoginRequestSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
  user_type: z.enum(['internal', 'external']).default('internal'),
  turnstile_token: z.string().optional(),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

/**
 * Token validation response schema
 */
export const TokenValidationResponseSchema = z.object({
  user: UserSchema,
});

export type TokenValidationResponse = z.infer<typeof TokenValidationResponseSchema>;

/**
 * Token refresh response schema
 */
export const TokenRefreshResponseSchema = z.object({
  token: z.string().min(1),
});

export type TokenRefreshResponse = z.infer<typeof TokenRefreshResponseSchema>;

/**
 * Password reset request schema
 */
export const PasswordResetRequestSchema = z.object({
  email: z.string().email('Email inválido'),
});

export type PasswordResetRequest = z.infer<typeof PasswordResetRequestSchema>;

/**
 * Password reset confirm schema
 */
export const PasswordResetConfirmSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  new_password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
});

export type PasswordResetConfirm = z.infer<typeof PasswordResetConfirmSchema>;

/**
 * Password change schema
 */
export const PasswordChangeSchema = z.object({
  current_password: z.string().min(1, 'Senha atual é obrigatória'),
  new_password: z
    .string()
    .min(8, 'Nova senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
});

export type PasswordChange = z.infer<typeof PasswordChangeSchema>;

/**
 * Profile update schema (partial user)
 */
export const ProfileUpdateSchema = UserSchema.partial().omit({
  id: true,
  type: true,
  status: true,
});

export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;

/**
 * Profile update response schema
 */
export const ProfileUpdateResponseSchema = z.object({
  user: UserSchema,
});

export type ProfileUpdateResponse = z.infer<typeof ProfileUpdateResponseSchema>;
