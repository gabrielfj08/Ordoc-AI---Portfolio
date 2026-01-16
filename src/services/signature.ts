/**
 * Signature Service - OrdocSign (Digital Signature) API Client
 *
 * Serviço completo para gerenciar assinaturas digitais, certificados,
 * solicitações de assinatura, lotes e auditoria.
 */

import apiClient from './api';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

// Certificate Types
export interface DigitalCertificate {
    id: string;
    certificate_type: 'A1' | 'A3' | 'SELF_SIGNED' | 'CA_ISSUED';
    subject_name: string;
    issuer_name: string;
    serial_number: string;
    valid_from: string;
    valid_until: string;
    status: 'active' | 'expired' | 'revoked' | 'suspended';
    is_default: boolean;
    fingerprint_sha256: string;
    key_usage: string[];
    extended_key_usage: string[];
    created_at: string;
    updated_at: string;
    last_used_at?: string;
    is_expired: boolean;
    is_valid: boolean;
    days_until_expiry?: number;
    usage_count?: number;
}

// Signature Template Types
export interface SignatureTemplate {
    id: string;
    name: string;
    description?: string;
    signature_type: 'SIMPLE' | 'ADVANCED' | 'QUALIFIED';
    hash_algorithm: 'SHA256' | 'SHA384' | 'SHA512';
    show_signature_image: boolean;
    signature_position: Record<string, any>;
    signature_size: Record<string, any>;
    require_reason: boolean;
    require_location: boolean;
    require_contact_info: boolean;
    require_approval: boolean;
    approval_workflow?: string;
    notify_signers: boolean;
    notify_completion: boolean;
    notification_template?: string;
    is_active: boolean;
    is_default: boolean;
    created_at: string;
    updated_at: string;
    created_by: string;
    created_by_name?: string;
    usage_count?: number;
}

// Signature Request Types
export interface SignatureRequest {
    id: string;
    organization: string;
    document: string;
    document_name?: string;
    template: string;
    template_name?: string;
    title: string;
    description?: string;
    status: 'draft' | 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'expired' | 'rejected';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    expires_at?: string;
    reminder_days: number;
    require_sequential_signing: boolean;
    allow_decline: boolean;
    require_all_signatures: boolean;
    signing_reason?: string;
    signing_location?: string;
    contact_info?: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    created_by_name?: string;
    completed_at?: string;
    progress_percentage?: number;
    signers?: SignatureRequestSigner[];
}

// Signature Request Signer Types
export interface SignatureRequestSigner {
    id: string;
    signature_request: string;
    signer_type: 'internal' | 'external' | 'email_only';
    user?: string;
    external_requester?: string;
    email: string;
    full_name: string;
    phone?: string;
    signing_order: number;
    status: 'pending' | 'notified' | 'viewed' | 'signed' | 'declined' | 'expired';
    require_certificate: boolean;
    access_token?: string;
    access_expires_at?: string;
    created_at: string;
    updated_at: string;
    notified_at?: string;
    viewed_at?: string;
    signed_at?: string;
}

// Document Signature Types
export interface DocumentSignature {
    id: string;
    organization: string;
    document: string;
    document_name?: string;
    signature_request: string;
    signer: string;
    signer_name?: string;
    certificate: string;
    certificate_name?: string;
    signature_type: 'digital' | 'electronic' | 'biometric';
    signature_data: string;
    hash_algorithm: string;
    document_hash: string;
    signing_reason?: string;
    signing_location?: string;
    contact_info?: string;
    page_number?: number;
    position_x?: number;
    position_y?: number;
    width?: number;
    height?: number;
    status: 'valid' | 'invalid' | 'expired' | 'revoked';
    validation_info: Record<string, any>;
    signed_at: string;
    validated_at?: string;
    ip_address?: string;
    user_agent?: string;
    geolocation?: Record<string, any>;
}

// Signature Audit Log Types
export interface SignatureAuditLog {
    id: string;
    organization: string;
    signature_request?: string;
    document_signature?: string;
    certificate?: string;
    action: string;
    description: string;
    user?: string;
    user_email: string;
    user_name: string;
    ip_address?: string;
    user_agent?: string;
    metadata: Record<string, any>;
    created_at: string;
}

// Signature Batch Types
export interface SignatureBatch {
    id: string;
    organization: string;
    name: string;
    description?: string;
    template: string;
    template_name?: string;
    status: 'draft' | 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    total_documents: number;
    processed_documents: number;
    successful_signatures: number;
    failed_signatures: number;
    auto_send_notifications: boolean;
    expires_at?: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    created_by_name?: string;
    started_at?: string;
    completed_at?: string;
    progress_percentage?: number;
}

// ============================================================================
// SIGNATURE SERVICE CLASS
// ============================================================================

class SignatureService_Class {
    // ==================== DIGITAL CERTIFICATES ====================

    /**
     * Listar certificados digitais
     */
    async getCertificates(filters?: {
        user?: string;
        is_valid?: boolean;
        certificate_type?: string;
        page?: number;
        page_size?: number;
    }): Promise<PaginatedResponse<DigitalCertificate>> {
        const response = await apiClient.get<PaginatedResponse<DigitalCertificate>>(
            '/ordoc-sign/certificates/',
            { params: filters }
        );
        return response.data;
    }

    /**
     * Obter certificado específico
     */
    async getCertificate(id: string): Promise<DigitalCertificate> {
        const response = await apiClient.get<DigitalCertificate>(`/ordoc-sign/certificates/${id}/`);
        return response.data;
    }

    /**
     * Listar meus certificados
     */
    async getMyCertificates(): Promise<DigitalCertificate[]> {
        const response = await apiClient.get<DigitalCertificate[]>('/ordoc-sign/certificates/my_certificates/');
        return response.data;
    }

    /**
     * Upload de certificado digital
     */
    async uploadCertificate(
        file: File,
        password: string,
        label?: string
    ): Promise<DigitalCertificate> {
        const formData = new FormData();
        formData.append('certificate_file', file);
        formData.append('password', password);
        formData.append('certificate_type', 'A1');
        if (label) {
            formData.append('label', label);
        }

        const response = await apiClient.post<DigitalCertificate>(
            '/ordoc-sign/certificates/upload/',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    }

    /**
     * Verificar certificado
     */
    async verifyCertificate(id: string): Promise<{
        is_valid: boolean;
        message: string;
        details: any;
    }> {
        const response = await apiClient.post(`/ordoc-sign/certificates/${id}/verify/`);
        return response.data;
    }

    /**
     * Definir certificado como padrão
     */
    async setDefaultCertificate(id: string): Promise<DigitalCertificate> {
        const response = await apiClient.post<DigitalCertificate>(`/ordoc-sign/certificates/${id}/set_default/`);
        return response.data;
    }

    /**
     * Revogar certificado
     */
    async revokeCertificate(id: string): Promise<void> {
        await apiClient.delete(`/ordoc-sign/certificates/${id}/`);
    }

    // ==================== SIGNATURE TEMPLATES ====================

    /**
     * Listar templates de assinatura
     */
    async getSignatureTemplates(filters?: {
        created_by?: string;
        is_active?: boolean;
        page?: number;
        page_size?: number;
    }): Promise<PaginatedResponse<SignatureTemplate>> {
        const response = await apiClient.get<PaginatedResponse<SignatureTemplate>>(
            '/ordoc-sign/templates/',
            { params: filters }
        );
        return response.data;
    }

    /**
     * Obter template específico
     */
    async getSignatureTemplate(id: string): Promise<SignatureTemplate> {
        const response = await apiClient.get<SignatureTemplate>(`/ordoc-sign/templates/${id}/`);
        return response.data;
    }

    /**
     * Listar templates ativos
     */
    async getActiveTemplates(): Promise<SignatureTemplate[]> {
        const response = await apiClient.get<SignatureTemplate[]>('/ordoc-sign/templates/active/');
        return response.data;
    }

    /**
     * Criar template de assinatura
     */
    async createSignatureTemplate(data: {
        name: string;
        description?: string;
        default_signers?: any[];
        default_message?: string;
        default_deadline_days?: number;
    }): Promise<SignatureTemplate> {
        const response = await apiClient.post<SignatureTemplate>('/ordoc-sign/templates/', data);
        return response.data;
    }

    /**
     * Atualizar template de assinatura
     */
    async updateSignatureTemplate(
        id: string,
        data: Partial<SignatureTemplate>
    ): Promise<SignatureTemplate> {
        const response = await apiClient.patch<SignatureTemplate>(`/ordoc-sign/templates/${id}/`, data);
        return response.data;
    }

    /**
     * Duplicar template
     */
    async duplicateTemplate(id: string): Promise<SignatureTemplate> {
        const response = await apiClient.post<SignatureTemplate>(`/ordoc-sign/templates/${id}/duplicate/`);
        return response.data;
    }

    /**
     * Deletar template
     */
    async deleteSignatureTemplate(id: string): Promise<void> {
        await apiClient.delete(`/ordoc-sign/templates/${id}/`);
    }

    // ==================== SIGNATURE REQUESTS ====================

    /**
     * Listar solicitações de assinatura
     */
    async getSignatureRequests(filters?: {
        status?: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'expired';
        created_by?: string;
        assigned_to?: string;
        document?: string;
        page?: number;
        page_size?: number;
    }): Promise<PaginatedResponse<SignatureRequest>> {
        const response = await apiClient.get<PaginatedResponse<SignatureRequest>>(
            '/ordoc-sign/requests/',
            { params: filters }
        );
        return response.data;
    }

    /**
     * Obter solicitação específica
     */
    async getSignatureRequest(id: string): Promise<SignatureRequest> {
        const response = await apiClient.get<SignatureRequest>(`/ordoc-sign/requests/${id}/`);
        return response.data;
    }

    /**
     * Minhas solicitações
     */
    async getMySignatureRequests(): Promise<SignatureRequest[]> {
        const response = await apiClient.get<SignatureRequest[]>('/ordoc-sign/requests/my_requests/');
        return response.data;
    }

    /**
     * Solicitações pendentes
     */
    async getPendingSignatureRequests(): Promise<SignatureRequest[]> {
        const response = await apiClient.get<SignatureRequest[]>('/ordoc-sign/requests/pending/');
        return response.data;
    }

    /**
     * Obter status da solicitação
     */
    async getSignatureRequestStatus(id: string): Promise<{
        status: string;
        progress_percentage: number;
        total_signers: number;
        signed_count: number;
        pending_count: number;
    }> {
        const response = await apiClient.get(`/ordoc-sign/requests/${id}/`);
        const request = response.data;
        return {
            status: request.status,
            progress_percentage: request.progress_percentage || 0,
            total_signers: request.signers?.length || 0,
            signed_count: request.signers?.filter((s: any) => s.status === 'signed').length || 0,
            pending_count: request.signers?.filter((s: any) => s.status === 'pending').length || 0,
        };
    }

    /**
     * Criar solicitação de assinatura
     */
    async createSignatureRequest(data: {
        document_id: string;
        signers: Array<{
            user_id?: string;
            email?: string;
            name?: string;
            order?: number;
            signature_type?: string;
        }>;
        message?: string;
        deadline?: string;
        template_id?: string;
    }): Promise<SignatureRequest> {
        const response = await apiClient.post<SignatureRequest>('/ordoc-sign/requests/', data);
        return response.data;
    }

    /**
     * Submeter solicitação de assinatura
     */
    async submitSignatureRequest(id: string): Promise<void> {
        await apiClient.post(`/ordoc-sign/requests/${id}/submit/`);
    }

    /**
     * Cancelar solicitação de assinatura
     */
    async cancelSignatureRequest(id: string): Promise<void> {
        await apiClient.post(`/ordoc-sign/requests/${id}/cancel/`);
    }

    /**
     * Enviar lembretes aos signatários
     */
    async remindSigners(id: string): Promise<void> {
        await apiClient.post(`/ordoc-sign/requests/${id}/remind/`);
    }

    /**
     * Listar assinantes de uma solicitação
     */
    async getRequestSigners(requestId: string): Promise<SignatureRequestSigner[]> {
        const response = await apiClient.get<SignatureRequestSigner[]>(
            `/ordoc-sign/requests/${requestId}/signers/`
        );
        return response.data;
    }

    /**
     * Listar assinaturas de uma solicitação
     */
    async getRequestSignatures(requestId: string): Promise<DocumentSignature[]> {
        const response = await apiClient.get<DocumentSignature[]>(
            `/ordoc-sign/requests/${requestId}/signatures/`
        );
        return response.data;
    }

    // ==================== SIGNERS ====================

    /**
     * Obter signatário específico
     */
    async getSigner(id: string): Promise<SignatureRequestSigner> {
        const response = await apiClient.get<SignatureRequestSigner>(`/ordoc-sign/signers/${id}/`);
        return response.data;
    }

    /**
     * Minhas atribuições de assinatura
     */
    async getMyAssignments(): Promise<SignatureRequestSigner[]> {
        const response = await apiClient.get<SignatureRequestSigner[]>('/ordoc-sign/signers/my_assignments/');
        return response.data;
    }

    /**
     * Assinar documento
     */
    async signDocument(data: {
        signer_id: string;
        certificate_id?: string;
        signature_image?: File;
        signature_text?: string;
        signature_type?: 'digital' | 'electronic' | 'handwritten';
    }): Promise<DocumentSignature> {
        const formData = new FormData();

        if (data.certificate_id) {
            formData.append('certificate_id', data.certificate_id);
        }
        if (data.signature_image) {
            formData.append('signature_image', data.signature_image);
        }
        if (data.signature_text) {
            formData.append('signature_text', data.signature_text);
        }
        if (data.signature_type) {
            formData.append('signature_type', data.signature_type);
        }

        const response = await apiClient.post<DocumentSignature>(
            `/ordoc-sign/signers/${data.signer_id}/sign/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    }

    /**
     * Recusar assinatura
     */
    async rejectSignature(signerId: string, reason: string): Promise<void> {
        await apiClient.post(`/ordoc-sign/signers/${signerId}/decline/`, { reason });
    }

    // ==================== DOCUMENT SIGNATURES ====================

    /**
     * Listar assinaturas de documento
     */
    async getDocumentSignatures(filters?: {
        document?: string;
        signer?: string;
        status?: string;
        page?: number;
        page_size?: number;
    }): Promise<PaginatedResponse<DocumentSignature>> {
        const response = await apiClient.get<PaginatedResponse<DocumentSignature>>(
            '/ordoc-sign/signatures/',
            { params: filters }
        );
        return response.data;
    }

    /**
     * Obter assinaturas de um documento específico
     */
    async getDocumentSignaturesForDocument(documentId: string): Promise<DocumentSignature[]> {
        const response = await apiClient.get<PaginatedResponse<DocumentSignature>>(
            '/ordoc-sign/signatures/',
            { params: { document: documentId } }
        );
        return response.data.results;
    }

    /**
     * Verificar assinatura de documento
     */
    async verifyDocumentSignature(id: string): Promise<{
        is_valid: boolean;
        message: string;
        certificate_valid: boolean;
        document_integrity: boolean;
        signature_valid: boolean;
        verified_at: string;
    }> {
        const response = await apiClient.post(`/ordoc-sign/signatures/${id}/verify/`);
        return response.data;
    }

    /**
     * Estatísticas de assinaturas
     */
    async getSignatureStats(filters?: {
        start_date?: string;
        end_date?: string;
    }): Promise<any> {
        const response = await apiClient.get('/ordoc-sign/signatures/stats/', { params: filters });
        return response.data;
    }

    // ==================== SIGNATURE BATCHES ====================

    /**
     * Listar lotes de assinatura
     */
    async getSignatureBatches(filters?: {
        created_by?: string;
        status?: string;
        page?: number;
        page_size?: number;
    }): Promise<PaginatedResponse<SignatureBatch>> {
        const response = await apiClient.get<PaginatedResponse<SignatureBatch>>(
            '/ordoc-sign/batches/',
            { params: filters }
        );
        return response.data;
    }

    /**
     * Obter lote específico
     */
    async getSignatureBatch(id: string): Promise<SignatureBatch> {
        const response = await apiClient.get<SignatureBatch>(`/ordoc-sign/batches/${id}/`);
        return response.data;
    }

    /**
     * Obter status do lote
     */
    async getSignatureBatchStatus(id: string): Promise<{
        status: string;
        progress_percentage: number;
        total_documents: number;
        processed_documents: number;
        successful_signatures: number;
        failed_signatures: number;
    }> {
        const response = await apiClient.get(`/ordoc-sign/batches/${id}/`);
        const batch = response.data;
        return {
            status: batch.status,
            progress_percentage: batch.progress_percentage || 0,
            total_documents: batch.total_documents || 0,
            processed_documents: batch.processed_documents || 0,
            successful_signatures: batch.successful_signatures || 0,
            failed_signatures: batch.failed_signatures || 0,
        };
    }

    /**
     * Criar lote de assinatura
     */
    async createSignatureBatch(data: {
        name: string;
        description?: string;
        signature_requests: string[];
    }): Promise<SignatureBatch> {
        const response = await apiClient.post<SignatureBatch>('/ordoc-sign/batches/', data);
        return response.data;
    }

    /**
     * Processar lote
     */
    async processBatch(id: string): Promise<void> {
        await apiClient.post(`/ordoc-sign/batches/${id}/process/`);
    }

    /**
     * Cancelar lote
     */
    async cancelBatch(id: string): Promise<void> {
        await apiClient.post(`/ordoc-sign/batches/${id}/cancel/`);
    }

    // ==================== AUDIT LOGS ====================

    /**
     * Listar logs de auditoria
     */
    async getSignatureAuditLogs(filters?: {
        signature_request?: string;
        document_signature?: string;
        action_type?: string;
        user?: string;
        page?: number;
        page_size?: number;
    }): Promise<PaginatedResponse<SignatureAuditLog>> {
        const response = await apiClient.get<PaginatedResponse<SignatureAuditLog>>(
            '/ordoc-sign/audit-logs/',
            { params: filters }
        );
        return response.data;
    }

    /**
     * Obter logs de auditoria de uma solicitação
     */
    async getAuditLogsForRequest(requestId: string): Promise<SignatureAuditLog[]> {
        const response = await apiClient.get<PaginatedResponse<SignatureAuditLog>>(
            '/ordoc-sign/audit-logs/',
            { params: { signature_request: requestId } }
        );
        return response.data.results;
    }
}

export const signatureService = new SignatureService_Class();
export default signatureService;
