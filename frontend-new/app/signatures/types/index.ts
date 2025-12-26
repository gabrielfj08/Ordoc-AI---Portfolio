// ===========================
// ENUMS E TIPOS
// ===========================

export type SignatureRequestStatus =
    | 'draft'
    | 'pending'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'expired'
    | 'rejected'

export type SignerStatus =
    | 'pending'
    | 'notified'
    | 'viewed'
    | 'signed'
    | 'declined'
    | 'expired'

export type Priority = 'low' | 'normal' | 'high' | 'urgent'

export type SignerType = 'internal' | 'external' | 'email_only'

export type CertificateType = 'A1' | 'A3' | 'SELF_SIGNED' | 'CA_ISSUED'

export type CertificateStatus = 'active' | 'expired' | 'revoked' | 'suspended'

export type SignatureType = 'SIMPLE' | 'ADVANCED' | 'QUALIFIED'

// ===========================
// INTERFACES PRINCIPAIS
// ===========================

export interface SignatureRequest {
    id: string
    title: string
    description: string
    document: string
    document_name?: string
    template: string
    template_name?: string
    status: SignatureRequestStatus
    priority: Priority
    expires_at: string | null
    progress_percentage: number
    signers_count: number
    signed_count: number
    pending_count: number
    created_at: string
    updated_at: string
    created_by: string
    created_by_name?: string
    completed_at?: string | null
    signing_reason?: string
    signing_location?: string
    require_sequential_signing: boolean
    allow_decline: boolean
    require_all_signatures: boolean
}

export interface SignatureRequestSigner {
    id: string
    signature_request: string
    signature_request_title?: string
    document_name?: string
    signer_type: SignerType
    user?: string | null
    user_name?: string
    external_requester?: string | null
    external_requester_name?: string
    email: string
    full_name: string
    phone?: string
    signing_order: number
    status: SignerStatus
    require_certificate: boolean
    access_token?: string
    access_expires_at?: string | null
    created_at: string
    updated_at: string
    notified_at?: string | null
    viewed_at?: string | null
    signed_at?: string | null
    can_sign: boolean
    signing_url?: string
    deadline?: string | null
    priority?: Priority
}

export interface DigitalCertificate {
    id: string
    certificate_type: CertificateType
    subject_name: string
    issuer_name: string
    serial_number: string
    valid_from: string
    valid_until: string
    status: CertificateStatus
    is_default: boolean
    is_expired: boolean
    is_valid: boolean
    days_until_expiry: number
    usage_count: number
    created_at: string
    updated_at: string
    last_used_at?: string | null
}

export interface SignatureTemplate {
    id: string
    name: string
    description: string
    signature_type: SignatureType
    hash_algorithm: 'SHA256' | 'SHA384' | 'SHA512'
    show_signature_image: boolean
    signature_position: Record<string, any>
    signature_size: Record<string, any>
    require_reason: boolean
    require_location: boolean
    require_contact_info: boolean
    require_approval: boolean
    notify_signers: boolean
    notify_completion: boolean
    is_active: boolean
    is_default: boolean
    created_at: string
    updated_at: string
    created_by: string
    created_by_name?: string
    usage_count: number
}

export interface DocumentSignature {
    id: string
    document: string
    signature_request: string
    signer: string
    signer_name?: string
    certificate: string
    signature_type: 'digital' | 'electronic' | 'biometric'
    signature_data: string
    hash_algorithm: string
    document_hash: string
    signing_reason?: string
    signing_location?: string
    contact_info?: string
    page_number?: number | null
    position_x?: number | null
    position_y?: number | null
    width?: number | null
    height?: number | null
    status: 'valid' | 'invalid' | 'expired' | 'revoked'
    validation_info: Record<string, any>
    signed_at: string
    validated_at?: string | null
    ip_address?: string | null
    user_agent?: string
    geolocation: Record<string, any>
}

export interface SignatureBatch {
    id: string
    name: string
    description: string
    template: string
    status: 'draft' | 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
    total_documents: number
    processed_documents: number
    successful_signatures: number
    failed_signatures: number
    progress_percentage: number
    auto_send_notifications: boolean
    expires_at?: string | null
    created_at: string
    updated_at: string
    created_by: string
    started_at?: string | null
    completed_at?: string | null
}

export interface SignatureAuditLog {
    id: string
    signature_request?: string | null
    action: string
    description: string
    user_email: string
    user_name?: string
    ip_address?: string | null
    user_agent?: string
    metadata: Record<string, any>
    created_at: string
}

// ===========================
// DTOs (Data Transfer Objects)
// ===========================

export interface CreateSignatureRequestDto {
    document: string
    template: string
    title: string
    description?: string
    priority?: Priority
    expires_at?: string | null
    require_sequential_signing?: boolean
    allow_decline?: boolean
    require_all_signatures?: boolean
    signing_reason?: string
    signing_location?: string
    contact_info?: string
    signers: CreateSignerDto[]
}

export interface CreateSignerDto {
    signer_type: SignerType
    user?: string | null
    external_requester?: string | null
    email: string
    full_name: string
    phone?: string
    signing_order: number
    require_certificate?: boolean
}

export interface SignDocumentDto {
    certificate: string
    signature_data: string
    signing_reason?: string
    signing_location?: string
    contact_info?: string
    page_number?: number
    position_x?: number
    position_y?: number
}

export interface UploadCertificateDto {
    certificate_file: File
    password?: string
    certificate_type?: CertificateType
    is_default?: boolean
}

// ===========================
// RESPONSE TYPES
// ===========================

export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

export interface ApiError {
    detail?: string
    message?: string
    errors?: Record<string, string[]>
}
