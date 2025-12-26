import apiClient from '@/services/api-client'
import type {
    SignatureRequest,
    SignatureRequestSigner,
    DigitalCertificate,
    SignatureTemplate,
    DocumentSignature,
    SignatureBatch,
    SignatureAuditLog,
    CreateSignatureRequestDto,
    CreateSignerDto,
    SignDocumentDto,
    PaginatedResponse,
} from '../types'

const BASE_URL = '/api/ordoc-sign/api'

// ===========================
// SIGNATURE REQUESTS API
// ===========================

export const signatureRequestsApi = {
    /**
     * Listar solicitações de assinatura
     */
    list: async (params?: {
        status?: string
        priority?: string
        search?: string
        page?: number
    }) => {
        const response = await apiClient.get<PaginatedResponse<SignatureRequest>>(
            `${BASE_URL}/requests/`,
            { params }
        )
        return response.data
    },

    /**
     * Criar nova solicitação de assinatura
     */
    create: async (data: CreateSignatureRequestDto) => {
        const response = await apiClient.post<SignatureRequest>(
            `${BASE_URL}/requests/`,
            data
        )
        return response.data
    },

    /**
     * Obter detalhes de uma solicitação
     */
    retrieve: async (id: string) => {
        const response = await apiClient.get<SignatureRequest>(
            `${BASE_URL}/requests/${id}/`
        )
        return response.data
    },

    /**
     * Atualizar solicitação
     */
    update: async (id: string, data: Partial<SignatureRequest>) => {
        const response = await apiClient.patch<SignatureRequest>(
            `${BASE_URL}/requests/${id}/`,
            data
        )
        return response.data
    },

    /**
     * Deletar solicitação
     */
    delete: async (id: string) => {
        await apiClient.delete(`${BASE_URL}/requests/${id}/`)
    },

    /**
     * Submeter solicitação para assinatura
     */
    submit: async (id: string) => {
        const response = await apiClient.post<SignatureRequest>(
            `${BASE_URL}/requests/${id}/submit/`
        )
        return response.data
    },

    /**
     * Cancelar solicitação
     */
    cancel: async (id: string) => {
        const response = await apiClient.post<SignatureRequest>(
            `${BASE_URL}/requests/${id}/cancel/`
        )
        return response.data
    },

    /**
     * Listar assinantes de uma solicitação
     */
    signers: async (id: string) => {
        const response = await apiClient.get<PaginatedResponse<SignatureRequestSigner>>(
            `${BASE_URL}/requests/${id}/signers/`
        )
        return response.data
    },

    /**
     * Listar assinaturas aplicadas
     */
    signatures: async (id: string) => {
        const response = await apiClient.get<PaginatedResponse<DocumentSignature>>(
            `${BASE_URL}/requests/${id}/signatures/`
        )
        return response.data
    },

    /**
     * Listar solicitações criadas pelo usuário atual
     */
    myRequests: async () => {
        const response = await apiClient.get<PaginatedResponse<SignatureRequest>>(
            `${BASE_URL}/requests/my_requests/`
        )
        return response.data
    },

    /**
     * Listar solicitações pendentes
     */
    pending: async () => {
        const response = await apiClient.get<PaginatedResponse<SignatureRequest>>(
            `${BASE_URL}/requests/pending/`
        )
        return response.data
    },
}

// ===========================
// SIGNERS API
// ===========================

export const signersApi = {
    /**
     * Listar assinantes
     */
    list: async (params?: { signature_request?: string; status?: string }) => {
        const response = await apiClient.get<PaginatedResponse<SignatureRequestSigner>>(
            `${BASE_URL}/signers/`,
            { params }
        )
        return response.data
    },

    /**
     * Adicionar assinante
     */
    create: async (data: CreateSignerDto & { signature_request: string }) => {
        const response = await apiClient.post<SignatureRequestSigner>(
            `${BASE_URL}/signers/`,
            data
        )
        return response.data
    },

    /**
     * Obter detalhes do assinante
     */
    retrieve: async (id: string) => {
        const response = await apiClient.get<SignatureRequestSigner>(
            `${BASE_URL}/signers/${id}/`
        )
        return response.data
    },

    /**
     * Atualizar assinante
     */
    update: async (id: string, data: Partial<SignatureRequestSigner>) => {
        const response = await apiClient.patch<SignatureRequestSigner>(
            `${BASE_URL}/signers/${id}/`,
            data
        )
        return response.data
    },

    /**
     * Remover assinante
     */
    delete: async (id: string) => {
        await apiClient.delete(`${BASE_URL}/signers/${id}/`)
    },

    /**
     * Enviar notificação ao assinante
     */
    notify: async (id: string) => {
        const response = await apiClient.post<SignatureRequestSigner>(
            `${BASE_URL}/signers/${id}/notify/`
        )
        return response.data
    },

    /**
     * Registrar assinatura
     */
    sign: async (id: string, data: SignDocumentDto) => {
        const response = await apiClient.post<SignatureRequestSigner>(
            `${BASE_URL}/signers/${id}/sign/`,
            data
        )
        return response.data
    },

    /**
     * Recusar assinatura
     */
    decline: async (id: string, reason?: string) => {
        const response = await apiClient.post<SignatureRequestSigner>(
            `${BASE_URL}/signers/${id}/decline/`,
            { reason }
        )
        return response.data
    },

    /**
     * Listar assinaturas atribuídas ao usuário atual
     */
    myAssignments: async () => {
        const response = await apiClient.get<PaginatedResponse<SignatureRequestSigner>>(
            `${BASE_URL}/signers/my_assignments/`
        )
        return response.data
    },

    /**
     * Listar assinaturas pendentes
     */
    pendingSignatures: async () => {
        const response = await apiClient.get<PaginatedResponse<SignatureRequestSigner>>(
            `${BASE_URL}/signers/pending_signatures/`
        )
        return response.data
    },
}

// ===========================
// CERTIFICATES API
// ===========================

export const certificatesApi = {
    /**
     * Listar certificados
     */
    list: async (params?: { status?: string; certificate_type?: string }) => {
        const response = await apiClient.get<PaginatedResponse<DigitalCertificate>>(
            `${BASE_URL}/certificates/`,
            { params }
        )
        return response.data
    },

    /**
     * Criar certificado
     */
    create: async (data: Partial<DigitalCertificate>) => {
        const response = await apiClient.post<DigitalCertificate>(
            `${BASE_URL}/certificates/`,
            data
        )
        return response.data
    },

    /**
     * Obter detalhes do certificado
     */
    retrieve: async (id: string) => {
        const response = await apiClient.get<DigitalCertificate>(
            `${BASE_URL}/certificates/${id}/`
        )
        return response.data
    },

    /**
     * Atualizar certificado
     */
    update: async (id: string, data: Partial<DigitalCertificate>) => {
        const response = await apiClient.patch<DigitalCertificate>(
            `${BASE_URL}/certificates/${id}/`,
            data
        )
        return response.data
    },

    /**
     * Deletar certificado
     */
    delete: async (id: string) => {
        await apiClient.delete(`${BASE_URL}/certificates/${id}/`)
    },

    /**
     * Upload de certificado digital
     */
    upload: async (file: File, password?: string, certificateType?: string, isDefault?: boolean) => {
        const formData = new FormData()
        formData.append('certificate_file', file)
        if (password) formData.append('password', password)
        if (certificateType) formData.append('certificate_type', certificateType)
        if (isDefault !== undefined) formData.append('is_default', String(isDefault))

        const response = await apiClient.post<DigitalCertificate>(
            `${BASE_URL}/certificates/upload/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        return response.data
    },

    /**
     * Verificar certificado
     */
    verify: async (id: string) => {
        const response = await apiClient.post<{ valid: boolean; message: string }>(
            `${BASE_URL}/certificates/${id}/verify/`
        )
        return response.data
    },

    /**
     * Definir como certificado padrão
     */
    setDefault: async (id: string) => {
        const response = await apiClient.post<DigitalCertificate>(
            `${BASE_URL}/certificates/${id}/set_default/`
        )
        return response.data
    },

    /**
     * Listar certificados do usuário atual
     */
    myCertificates: async () => {
        const response = await apiClient.get<PaginatedResponse<DigitalCertificate>>(
            `${BASE_URL}/certificates/my_certificates/`
        )
        return response.data
    },
}

// ===========================
// TEMPLATES API
// ===========================

export const templatesApi = {
    /**
     * Listar templates
     */
    list: async (params?: { is_active?: boolean; signature_type?: string }) => {
        const response = await apiClient.get<PaginatedResponse<SignatureTemplate>>(
            `${BASE_URL}/templates/`,
            { params }
        )
        return response.data
    },

    /**
     * Criar template
     */
    create: async (data: Partial<SignatureTemplate>) => {
        const response = await apiClient.post<SignatureTemplate>(
            `${BASE_URL}/templates/`,
            data
        )
        return response.data
    },

    /**
     * Obter detalhes do template
     */
    retrieve: async (id: string) => {
        const response = await apiClient.get<SignatureTemplate>(
            `${BASE_URL}/templates/${id}/`
        )
        return response.data
    },

    /**
     * Atualizar template
     */
    update: async (id: string, data: Partial<SignatureTemplate>) => {
        const response = await apiClient.patch<SignatureTemplate>(
            `${BASE_URL}/templates/${id}/`,
            data
        )
        return response.data
    },

    /**
     * Deletar template
     */
    delete: async (id: string) => {
        await apiClient.delete(`${BASE_URL}/templates/${id}/`)
    },

    /**
     * Listar templates ativos
     */
    active: async () => {
        const response = await apiClient.get<PaginatedResponse<SignatureTemplate>>(
            `${BASE_URL}/templates/active/`
        )
        return response.data
    },

    /**
     * Duplicar template
     */
    duplicate: async (id: string, newName: string) => {
        const response = await apiClient.post<SignatureTemplate>(
            `${BASE_URL}/templates/${id}/duplicate/`,
            { name: newName }
        )
        return response.data
    },
}

// ===========================
// SIGNATURES API
// ===========================

export const signaturesApi = {
    /**
     * Listar assinaturas
     */
    list: async (params?: {
        document?: string
        signature_request?: string
        status?: string
    }) => {
        const response = await apiClient.get<PaginatedResponse<DocumentSignature>>(
            `${BASE_URL}/signatures/`,
            { params }
        )
        return response.data
    },

    /**
     * Obter detalhes da assinatura
     */
    retrieve: async (id: string) => {
        const response = await apiClient.get<DocumentSignature>(
            `${BASE_URL}/signatures/${id}/`
        )
        return response.data
    },

    /**
     * Verificar assinatura
     */
    verify: async (id: string) => {
        const response = await apiClient.post<{ valid: boolean; message: string }>(
            `${BASE_URL}/signatures/${id}/verify/`
        )
        return response.data
    },

    /**
     * Listar assinaturas por documento
     */
    byDocument: async (documentId: string) => {
        const response = await apiClient.get<PaginatedResponse<DocumentSignature>>(
            `${BASE_URL}/signatures/by_document/`,
            { params: { document: documentId } }
        )
        return response.data
    },
}

// ===========================
// BATCHES API
// ===========================

export const batchesApi = {
    /**
     * Listar lotes
     */
    list: async (params?: { status?: string }) => {
        const response = await apiClient.get<PaginatedResponse<SignatureBatch>>(
            `${BASE_URL}/batches/`,
            { params }
        )
        return response.data
    },

    /**
     * Criar lote
     */
    create: async (data: Partial<SignatureBatch>) => {
        const response = await apiClient.post<SignatureBatch>(
            `${BASE_URL}/batches/`,
            data
        )
        return response.data
    },

    /**
     * Obter detalhes do lote
     */
    retrieve: async (id: string) => {
        const response = await apiClient.get<SignatureBatch>(
            `${BASE_URL}/batches/${id}/`
        )
        return response.data
    },

    /**
     * Atualizar lote
     */
    update: async (id: string, data: Partial<SignatureBatch>) => {
        const response = await apiClient.patch<SignatureBatch>(
            `${BASE_URL}/batches/${id}/`,
            data
        )
        return response.data
    },

    /**
     * Deletar lote
     */
    delete: async (id: string) => {
        await apiClient.delete(`${BASE_URL}/batches/${id}/`)
    },

    /**
     * Iniciar processamento do lote
     */
    start: async (id: string) => {
        const response = await apiClient.post<SignatureBatch>(
            `${BASE_URL}/batches/${id}/start/`
        )
        return response.data
    },

    /**
     * Cancelar lote
     */
    cancel: async (id: string) => {
        const response = await apiClient.post<SignatureBatch>(
            `${BASE_URL}/batches/${id}/cancel/`
        )
        return response.data
    },

    /**
     * Obter progresso do lote
     */
    progress: async (id: string) => {
        const response = await apiClient.get<{
            progress_percentage: number
            processed_documents: number
            total_documents: number
        }>(`${BASE_URL}/batches/${id}/progress/`)
        return response.data
    },
}

// ===========================
// AUDIT LOGS API
// ===========================

export const auditLogsApi = {
    /**
     * Listar logs de auditoria
     */
    list: async (params?: {
        signature_request?: string
        action?: string
        user_email?: string
    }) => {
        const response = await apiClient.get<PaginatedResponse<SignatureAuditLog>>(
            `${BASE_URL}/audit-logs/`,
            { params }
        )
        return response.data
    },

    /**
     * Obter detalhes do log
     */
    retrieve: async (id: string) => {
        const response = await apiClient.get<SignatureAuditLog>(
            `${BASE_URL}/audit-logs/${id}/`
        )
        return response.data
    },

    /**
     * Listar logs por solicitação
     */
    byRequest: async (requestId: string) => {
        const response = await apiClient.get<PaginatedResponse<SignatureAuditLog>>(
            `${BASE_URL}/audit-logs/by_request/`,
            { params: { signature_request: requestId } }
        )
        return response.data
    },

    /**
     * Listar logs por usuário
     */
    byUser: async (userEmail: string) => {
        const response = await apiClient.get<PaginatedResponse<SignatureAuditLog>>(
            `${BASE_URL}/audit-logs/by_user/`,
            { params: { user_email: userEmail } }
        )
        return response.data
    },
}
