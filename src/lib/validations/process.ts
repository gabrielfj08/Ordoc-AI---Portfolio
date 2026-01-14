import { z } from 'zod';

/**
 * Schema de validação para criação de processo
 */
export const createProcessSchema = z.object({
    name: z
        .string()
        .min(1, 'Nome do processo é obrigatório')
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .max(200, 'Nome deve ter no máximo 200 caracteres'),
    description: z
        .string()
        .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
        .optional(),
    priority: z.enum(['low', 'medium', 'high'], {
        message: 'Prioridade inválida',
    }),
    dueDate: z
        .string()
        .optional()
        .refine(
            (date) => {
                if (!date) return true;
                return new Date(date) > new Date();
            },
            { message: 'Data de vencimento deve ser futura' }
        ),
    assignedTo: z.string().optional(),
});

export type CreateProcessFormData = z.infer<typeof createProcessSchema>;

/**
 * Schema de validação para atualização de processo
 */
export const updateProcessSchema = createProcessSchema.partial().extend({
    status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional(),
});

export type UpdateProcessFormData = z.infer<typeof updateProcessSchema>;

/**
 * Schema de validação para criação de tarefa
 */
export const createTaskSchema = z.object({
    name: z
        .string()
        .min(1, 'Nome da tarefa é obrigatório')
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .max(200, 'Nome deve ter no máximo 200 caracteres'),
    description: z
        .string()
        .max(500, 'Descrição deve ter no máximo 500 caracteres')
        .optional(),
    assignedTo: z.string().optional(),
    dueDate: z
        .string()
        .optional()
        .refine(
            (date) => {
                if (!date) return true;
                return new Date(date) > new Date();
            },
            { message: 'Data de vencimento deve ser futura' }
        ),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

/**
 * Schema de validação para atualização de tarefa
 */
export const updateTaskSchema = createTaskSchema.partial().extend({
    status: z.enum(['pending', 'in_progress', 'completed']).optional(),
});

export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;

/**
 * Schema de validação para filtros de processo
 */
export const processFiltersSchema = z.object({
    status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    ownerId: z.string().optional(),
    search: z.string().optional(),
});

export type ProcessFiltersFormData = z.infer<typeof processFiltersSchema>;
