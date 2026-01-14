import { z } from 'zod';

/**
 * Schema de validação para upload de documento
 */
export const uploadDocumentSchema = z.object({
    file: z
        .instanceof(File, { message: 'Arquivo é obrigatório' })
        .refine((file) => file.size <= 50 * 1024 * 1024, {
            message: 'Arquivo deve ter no máximo 50MB',
        })
        .refine(
            (file) => {
                const allowedTypes = [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                ];
                return allowedTypes.includes(file.type);
            },
            {
                message: 'Tipo de arquivo não suportado',
            }
        ),
    folderId: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

export type UploadDocumentFormData = z.infer<typeof uploadDocumentSchema>;

/**
 * Schema de validação para criação de pasta
 */
export const createFolderSchema = z.object({
    name: z
        .string()
        .min(1, 'Nome da pasta é obrigatório')
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .max(100, 'Nome deve ter no máximo 100 caracteres')
        .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Nome contém caracteres inválidos'),
    parentId: z.string().optional(),
});

export type CreateFolderFormData = z.infer<typeof createFolderSchema>;

/**
 * Schema de validação para compartilhamento de documento
 */
export const shareDocumentSchema = z.object({
    documentId: z.string().min(1, 'ID do documento é obrigatório'),
    userIds: z
        .array(z.string())
        .min(1, 'Selecione pelo menos um usuário'),
    permission: z.enum(['view', 'edit', 'admin'], {
        message: 'Permissão inválida',
    }),
    message: z.string().optional(),
});

export type ShareDocumentFormData = z.infer<typeof shareDocumentSchema>;

/**
 * Schema de validação para renomear documento
 */
export const renameDocumentSchema = z.object({
    name: z
        .string()
        .min(1, 'Nome é obrigatório')
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .max(255, 'Nome deve ter no máximo 255 caracteres'),
});

export type RenameDocumentFormData = z.infer<typeof renameDocumentSchema>;

/**
 * Schema de validação para mover documento
 */
export const moveDocumentSchema = z.object({
    documentId: z.string().min(1, 'ID do documento é obrigatório'),
    targetFolderId: z.string().min(1, 'Pasta de destino é obrigatória'),
});

export type MoveDocumentFormData = z.infer<typeof moveDocumentSchema>;
