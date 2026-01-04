import apiClient from './api-client'

const BASE_URL = '/api/v1/ordoc-sign'

// ===========================
// TYPES
// ===========================

export interface DigitalCertificate {
    id: string
    certificate_type: 'A1' | 'A3' | 'A4'
    subject_name: string
    issuer_name: string
    serial_number: string
    valid_from: string
    valid_until: string
    fingerprint_sha256: string
    key_usage: string[]
    extended_key_usage: string[]
    status: 'active' | 'expired' | 'revoked' | 'suspended'
    is_default: boolean
    is_expired: boolean
    last_used_at?: string
    created_at: string
}

export interface SignatureTemplate {
    id: string
    name: string
    description?: string
    signature_type: 'digital' | 'electronic' | 'biometric'
    hash_algorithm: 'SHA256' | 'SHA384' | 'SHA512'
    show_signature_image: boolean
    signature_position: string
    signature_size: any
    require_reason: boolean
    require_location: boolean
    require_contact_info: boolean
    require_approval: boolean
    approval_workflow?: string
    notify_signers: boolean
    notify_completion: boolean
    notification_template?: string
    is_active: boolean
    is_default: boolean
    created_at: string
}

export interface SignatureRequest {
    id: string
    title: string
    description?: string
    document: any
    template?: SignatureTemplate
    status: 'draft' | 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'expired'
    priority: 'low' | 'normal' | 'high' | 'urgent'
    expires_at?: string
    require_sequential_signing: boolean
    allow_decline: boolean
    require_all_signatures: boolean
    signing_reason?: string
    signing_location?: string
    contact_info?: string
    created_by: any
    created_at: string
    completed_at?: string
}

export interface DocumentSignature {
    id: string
    document: any
    signature_request: string
    signer: any
    certificate: DigitalCertificate
    signature_type: 'digital' | 'electronic' | 'biometric'
    signature_data: string
    hash_algorithm: string
    document_hash: string
    signing_reason?: string
    signing_location?: string
    contact_info?: string
    ip_address?: string
    user_agent?: string
    signed_at: string
    validated_at?: string
    status: 'pending' | 'valid' | 'invalid' | 'expired'
}

export interface CertificateVerification {
    is_valid: boolean
    message: string
    details: {
        certificate_type: string
        subject_name: string
        issuer_name: string
        valid_from: string
        valid_until: string
        status: string
        is_expired: boolean
        days_until_expiry?: number
    }
}

export interface SignatureVerification {
    is_valid: boolean
    message: string
    certificate_valid: boolean
    document_integrity: boolean
    signature_valid: boolean
    verified_at: string
}

export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

// ===========================
// CERTIFICATES API
// ===========================

export const certificatesApi = {
    /**
     * Lista certificados digitais
     */
    list: async (params?: {
        certificate_type?: string
        status?: string
    }) => {
        const response = await apiClient.get<PaginatedResponse<DigitalCertificate>>(
            `${BASE_URL}/certificates/`,
            { params }
        )
        return response.data
    },

    /**
     * Obtém detalhes de um certificado
     */
    get: async (id: string) => {
        const response = await apiClient.get<DigitalCertificate>(
            `${BASE_URL}/certificates/${id}/`
        )
        return response.data
    },

    /**
     * Upload de certificado digital
     */
    upload: async (data: {
        certificate_file: File
        password?: string
        certificate_type: 'A1' | 'A3' | 'A4'
        is_default?: boolean
    }) => {
        const formData = new FormData()
        formData.append('certificate_file', data.certificate_file)
        if (data.password) formData.append('password', data.password)
        formData.append('certificate_type', data.certificate_type)
        if (data.is_default !== undefined) {
            formData.append('is_default', data.is_default.toString())
        }

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
        const response = await apiClient.post<CertificateVerification>(
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
     * Listar meus certificados
     */
    myCertificates: async () => {
        const response = await apiClient.get<PaginatedResponse<DigitalCertificate>>(
            `${BASE_URL}/certificates/my_certificates/`
        )
        return response.data
    },

    /**
     * Remover certificado
     */
    delete: async (id: string) => {
        await apiClient.delete(`${BASE_URL}/certificates/${id}/`)
    },
}

// ===========================
// TEMPLATES API
// ===========================

export const templatesApi = {
    /**
     * Lista templates de assinatura
     */
    list: async (params?: { is_active?: boolean }) => {
        const response = await apiClient.get<PaginatedResponse<SignatureTemplate>>(
            `${BASE_URL}/templates/`,
            { params }
        )
        return response.data
    },

    /**
     * Obtém detalhes de um template
     */
    get: async (id: string) => {
        const response = await apiClient.get<SignatureTemplate>(
            `${BASE_URL}/templates/${id}/`
        )
        return response.data
    },

    /**
     * Cria novo template
     */
    create: async (data: Partial<SignatureTemplate>) => {
        const response = await apiClient.post<SignatureTemplate>(
            `${BASE_URL}/templates/`,
            data
        )
        return response.data
    },

    /**
     * Atualiza template
     */
    update: async (id: string, data: Partial<SignatureTemplate>) => {
        const response = await apiClient.patch<SignatureTemplate>(
            `${BASE_URL}/templates/${id}/`,
            data
        )
        return response.data
    },

    /**
     * Remove template
     */
    delete: async (id: string) => {
        await apiClient.delete(`${BASE_URL}/templates/${id}/`)
    },

    /**
     * Lista templates ativos
     */
    active: async () => {
        const response = await apiClient.get<PaginatedResponse<SignatureTemplate>>(
            `${BASE_URL}/templates/active/`
        )
        return response.data
    },

    /**
     * Duplica template
     */
    duplicate: async (id: string) => {
        const response = await apiClient.post<SignatureTemplate>(
            `${BASE_URL}/templates/${id}/duplicate/`
        )
        return response.data
    },
}

// ===========================
// SIGNATURES API
// ===========================

export const signaturesApi = {
    /**
     * Lista assinaturas de documento
     */
    list: async (params?: {
        document?: string
        status?: string
        start_date?: string
        end_date?: string
    }) => {
        const response = await apiClient.get<PaginatedResponse<DocumentSignature>>(
            `${BASE_URL}/signatures/`,
            { params }
        )
        return response.data
    },

    /**
     * Obtém detalhes de uma assinatura
     */
    get: async (id: string) => {
        const response = await apiClient.get<DocumentSignature>(
            `${BASE_URL}/signatures/${id}/`
        )
        return response.data
    },

    /**
     * Verificar assinatura de documento
     */
    verify: async (id: string) => {
        const response = await apiClient.post<SignatureVerification>(
            `${BASE_URL}/signatures/${id}/verify/`
        )
        return response.data
    },

    /**
     * Verificar assinatura de arquivo PDF enviado
     */
    verifyFile: async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await apiClient.post<SignatureVerification>(
            `${BASE_URL}/signatures/verify_file/`,
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
     * Estatísticas de assinaturas
     */
    stats: async (params?: { start_date?: string; end_date?: string }) => {
        const response = await apiClient.get(
            `${BASE_URL}/signatures/stats/`,
            { params }
        )
        return response.data
    },
}

// ===========================
// REQUESTS API
// ===========================

export const requestsApi = {
    /**
     * Lista solicitações de assinatura
     */
    list: async (params?: {
        status?: string
        priority?: string
    }) => {
        const response = await apiClient.get<PaginatedResponse<SignatureRequest>>(
            `${BASE_URL}/requests/`,
            { params }
        )
        return response.data
    },

    /**
     * Obtém detalhes de uma solicitação
     */
    get: async (id: string) => {
        const response = await apiClient.get<SignatureRequest>(
            `${BASE_URL}/requests/${id}/`
        )
        return response.data
    },

    /**
     * Cria nova solicitação de assinatura
     */
    create: async (data: {
        document_id: string
        template_id?: string
        title: string
        description?: string
        signers: Array<{
            email: string
            full_name: string
            signer_type?: string
            signing_order?: number
        }>
        priority?: string
        expires_at?: string
    }) => {
        const response = await apiClient.post<SignatureRequest>(
            `${BASE_URL}/requests/`,
            data
        )
        return response.data
    },

    /**
     * Submete solicitação para assinatura
     */
    submit: async (id: string) => {
        const response = await apiClient.post(
            `${BASE_URL}/requests/${id}/submit/`
        )
        return response.data
    },

    /**
     * Cancela solicitação
     */
    cancel: async (id: string) => {
        const response = await apiClient.post<SignatureRequest>(
            `${BASE_URL}/requests/${id}/cancel/`
        )
        return response.data
    },

    /**
     * Minhas solicitações
     */
    myRequests: async () => {
        const response = await apiClient.get<PaginatedResponse<SignatureRequest>>(
            `${BASE_URL}/requests/my_requests/`
        )
        return response.data
    },

    /**
     * Solicitações pendentes
     */
    pending: async () => {
        const response = await apiClient.get<PaginatedResponse<SignatureRequest>>(
            `${BASE_URL}/requests/pending/`
        )
        return response.data
    },
}

export default {
    certificates: certificatesApi,
    templates: templatesApi,
    signatures: signaturesApi,
    requests: requestsApi,
}
