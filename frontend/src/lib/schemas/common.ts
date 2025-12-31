/**
 * Common Zod Schemas for API Validation
 *
 * Shared schemas used across multiple modules:
 * - Pagination
 * - API Responses
 * - Base entities
 *
 * Created as part of Sprint 6 - Frontend Type Safety + SEO
 */

import { z } from 'zod';

/**
 * Base entity schema - common fields for all entities
 */
export const BaseEntitySchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type BaseEntity = z.infer<typeof BaseEntitySchema>;

/**
 * Pagination parameters schema
 */
export const PaginationParamsSchema = z.object({
  page: z.number().int().positive().optional(),
  page_size: z.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  ordering: z.string().optional(),
});

export type PaginationParams = z.infer<typeof PaginationParamsSchema>;

/**
 * Generic paginated API response schema
 */
export function createPaginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    count: z.number().int().nonnegative(),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
    results: z.array(itemSchema),
  });
}

/**
 * API Error response schema
 */
export const ApiErrorSchema = z.object({
  error: z.string(),
  status: z.number().int(),
  detail: z.string().optional(),
  field_errors: z.record(z.array(z.string())).optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

/**
 * Validation error schema (from Django REST Framework)
 */
export const ValidationErrorSchema = z.object({
  detail: z.union([
    z.string(),
    z.record(z.array(z.string())),
    z.array(z.string()),
  ]),
});

export type ValidationError = z.infer<typeof ValidationErrorSchema>;

/**
 * Success response schema (generic)
 */
export const SuccessResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.unknown().optional(),
});

export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;

/**
 * Helper to validate API responses with Zod
 * Throws validation error if response doesn't match schema
 */
export function validateApiResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: string
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`API Validation Error${context ? ` (${context})` : ''}:`, {
        errors: error.errors,
        data,
      });
      throw new Error(
        `Invalid API response${context ? ` for ${context}` : ''}: ${error.errors
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join(', ')}`
      );
    }
    throw error;
  }
}

/**
 * Helper to safely validate with fallback
 * Returns null if validation fails instead of throwing
 */
export function safeValidateApiResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: string
): T | null {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn(`API Validation Warning${context ? ` (${context})` : ''}:`, {
        errors: error.errors,
        data,
      });
    }
    return null;
  }
}
