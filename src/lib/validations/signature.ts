import { z } from 'zod';

/**
 * Schema de validação para signatário
 */
export const signerSchema = z.object({
    name: z
        .string()
        .min(1, 'Nome é obrigatório')
        .min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z
        .string()
        .min(1, 'E-mail é obrigatório')
        .email('E-mail inválido'),
    role: z.enum(['signer', 'approver', 'witness'], {
        message: 'Função inválida',
    }),
    order: z
        .number()
        .int('Ordem deve ser um número inteiro')
        .min(1, 'Ordem deve ser no mínimo 1')
        .optional(),
});

export type SignerFormData = z.infer<typeof signerSchema>;

/**
 * Schema de validação para campo de assinatura
 */
export const signatureFieldSchema = z.object({
    type: z.enum(['signature', 'text', 'date', 'name'], {
        message: 'Tipo de campo inválido',
    }),
    page: z
        .number()
        .int('Página deve ser um número inteiro')
        .min(1, 'Página deve ser no mínimo 1'),
    x: z
        .number()
        .min(0, 'Posição X deve ser no mínimo 0')
        .max(100, 'Posição X deve ser no máximo 100'),
    y: z
        .number()
        .min(0, 'Posição Y deve ser no mínimo 0')
        .max(100, 'Posição Y deve ser no máximo 100'),
    signerId: z.string().optional(),
    label: z.string().optional(),
    required: z.boolean().optional(),
});

export type SignatureFieldFormData = z.infer<typeof signatureFieldSchema>;

/**
 * Schema de validação para criação de documento de assinatura
 */
export const createSignatureDocumentSchema = z.object({
    file: z
        .instanceof(File, { message: 'Arquivo PDF é obrigatório' })
        .refine((file) => file.type === 'application/pdf', {
            message: 'Apenas arquivos PDF são permitidos',
        })
        .refine((file) => file.size <= 20 * 1024 * 1024, {
            message: 'Arquivo deve ter no máximo 20MB',
        }),
    name: z
        .string()
        .min(1, 'Nome do documento é obrigatório')
        .max(255, 'Nome deve ter no máximo 255 caracteres'),
    signers: z
        .array(signerSchema)
        .min(1, 'Adicione pelo menos um signatário'),
    message: z
        .string()
        .max(500, 'Mensagem deve ter no máximo 500 caracteres')
        .optional(),
    expiresAt: z
        .string()
        .optional()
        .refine(
            (date) => {
                if (!date) return true;
                return new Date(date) > new Date();
            },
            { message: 'Data de expiração deve ser futura' }
        ),
});

export type CreateSignatureDocumentFormData = z.infer<typeof createSignatureDocumentSchema>;

/**
 * Schema de validação para assinatura de documento
 */
export const signDocumentSchema = z.object({
    documentId: z.string().min(1, 'ID do documento é obrigatório'),
    signerId: z.string().min(1, 'ID do signatário é obrigatório'),
    signature: z.string().min(1, 'Assinatura é obrigatória'),
    certificate: z.string().optional(),
});

export type SignDocumentFormData = z.infer<typeof signDocumentSchema>;
