/**
 * Signature Hooks - React Query hooks para OrdocSign (Digital Signature)
 *
 * Gerencia estado, cache e invalidação para:
 * - Solicitações de assinatura (Signature Requests)
 * - Assinaturas (Document Signatures)
 * - Signatários (Signers)
 * - Certificados digitais
 * - Templates de assinatura
 * - Lotes de assinatura (Batches)
 * - Audit logs
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import signatureService, {
    SignatureRequest,
    DocumentSignature,
    SignatureRequestSigner,
    DigitalCertificate,
    SignatureTemplate,
    SignatureBatch,
    SignatureAuditLog,
    PaginatedResponse,
} from '@/services/signature';

// ============================================================================
// QUERY KEYS FACTORY
// ============================================================================

export const signatureKeys = {
    all: ['signatures'] as const,

    // Signature Requests
    requests: () => [...signatureKeys.all, 'requests'] as const,
    requestsList: (filters?: Record<string, any>) => [...signatureKeys.requests(), 'list', filters] as const,
    request: (id: string) => [...signatureKeys.requests(), 'detail', id] as const,
    requestSigners: (id: string) => [...signatureKeys.request(id), 'signers'] as const,
    requestStatus: (id: string) => [...signatureKeys.request(id), 'status'] as const,
    myRequests: () => [...signatureKeys.requests(), 'my-requests'] as const,
    pendingRequests: () => [...signatureKeys.requests(), 'pending'] as const,

    // Document Signatures
    documentSignatures: () => [...signatureKeys.all, 'document-signatures'] as const,
    documentSignaturesList: (filters?: Record<string, any>) => [...signatureKeys.documentSignatures(), 'list', filters] as const,
    documentSignature: (id: string) => [...signatureKeys.documentSignatures(), 'detail', id] as const,
    documentSignaturesFor: (documentId: string) => [...signatureKeys.documentSignatures(), 'for-document', documentId] as const,

    // Signers
    signers: () => [...signatureKeys.all, 'signers'] as const,
    signersList: (requestId?: string) => [...signatureKeys.signers(), 'list', requestId] as const,
    signer: (id: string) => [...signatureKeys.signers(), 'detail', id] as const,

    // Certificates
    certificates: () => [...signatureKeys.all, 'certificates'] as const,
    certificatesList: (filters?: Record<string, any>) => [...signatureKeys.certificates(), 'list', filters] as const,
    certificate: (id: string) => [...signatureKeys.certificates(), 'detail', id] as const,
    myCertificates: () => [...signatureKeys.certificates(), 'my-certificates'] as const,

    // Templates
    templates: () => [...signatureKeys.all, 'templates'] as const,
    templatesList: (filters?: Record<string, any>) => [...signatureKeys.templates(), 'list', filters] as const,
    template: (id: string) => [...signatureKeys.templates(), 'detail', id] as const,

    // Batches
    batches: () => [...signatureKeys.all, 'batches'] as const,
    batchesList: (filters?: Record<string, any>) => [...signatureKeys.batches(), 'list', filters] as const,
    batch: (id: string) => [...signatureKeys.batches(), 'detail', id] as const,
    batchStatus: (id: string) => [...signatureKeys.batch(id), 'status'] as const,

    // Audit Logs
    auditLogs: () => [...signatureKeys.all, 'audit-logs'] as const,
    auditLogsList: (filters?: Record<string, any>) => [...signatureKeys.auditLogs(), 'list', filters] as const,
    auditLog: (id: string) => [...signatureKeys.auditLogs(), 'detail', id] as const,
    auditLogsForRequest: (requestId: string) => [...signatureKeys.auditLogs(), 'for-request', requestId] as const,
};

// ============================================================================
// SIGNATURE REQUESTS - QUERIES
// ============================================================================

export function useSignatureRequests(
    filters?: {
        status?: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'expired';
        created_by?: string;
        assigned_to?: string;
        document?: string;
        page?: number;
        page_size?: number;
    },
    options?: Omit<UseQueryOptions<PaginatedResponse<SignatureRequest>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: signatureKeys.requestsList(filters),
        queryFn: () => signatureService.getSignatureRequests(filters),
        ...options,
    });
}

export function useSignatureRequest(
    id: string,
    options?: Omit<UseQueryOptions<SignatureRequest>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: signatureKeys.request(id),
        queryFn: () => signatureService.getSignatureRequest(id),
        enabled: !!id,
        ...options,
    });
}

export function useMySignatureRequests(
    options?: Omit<UseQueryOptions<SignatureRequest[]>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: signatureKeys.myRequests(),
        queryFn: () => signatureService.getMySignatureRequests(),
        ...options,
    });
}

export function usePendingSignatureRequests(
    options?: Omit<UseQueryOptions<SignatureRequest[]>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: signatureKeys.pendingRequests(),
        queryFn: () => signatureService.getPendingSignatureRequests(),
        ...options,
    });
}

export function useSignatureRequestStatus(
    id: string,
    options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: signatureKeys.requestStatus(id),
        queryFn: () => signatureService.getSignatureRequestStatus(id),
        enabled: !!id,
        refetchInterval: 10000, // Poll every 10s for status updates
        ...options,
    });
}

// ============================================================================
// SIGNERS - QUERIES
// ============================================================================

export function useRequestSigners(
    requestId: string,
    options?: Omit<UseQueryOptions<SignatureRequestSigner[]>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: signatureKeys.requestSigners(requestId),
        queryFn: () => signatureService.getRequestSigners(requestId),
        enabled: !!requestId,
        ...options,
    });
}

export function useSigner(
    id: string,
    options?: Omit<UseQueryOptions<SignatureRequestSigner>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: signatureKeys.signer(id),
        queryFn: () => signatureService.getSigner(id),
        enabled: !!id,
        ...options,
    });
}

// ============================================================================
// DOCUMENT SIGNATURES - QUERIES
// ============================================================================

export function useDocumentSignatures(
    filters?: {
        document?: string;
        signer?: string;
        status?: string;
        page?: number;
        page_size?: number;
    },
    options?: Omit<UseQueryOptions<PaginatedResponse<DocumentSignature>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: signatureKeys.documentSignaturesList(filters),
        queryFn: () => signatureService.getDocumentSignatures(filters),
        ...options,
    });
}

export function useDocumentSignaturesFor(
    documentId: string,
    options?: Omit<UseQueryOptions<DocumentSignature[]>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: signatureKeys.documentSignaturesFor(documentId),
        queryFn: () => signatureService.getDocumentSignaturesForDocument(documentId),
        enabled: !!documentId,
        ...options,
    });
}

// ============================================================================
// CERTIFICATES - QUERIES
// ============================================================================

export function useCertificates(
    filters?: {
        user?: string;
        is_valid?: boolean;
        certificate_type?: string;
        page?: number;
        page_size?: number;
    },
    options?: Omit<UseQueryOptions<PaginatedResponse<DigitalCertificate>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: signatureKeys.certificatesList(filters),
        queryFn: () => signatureService.getCertificates(filters),
        ...options,
    });
}

export function useMyCertificates(
    options?: Omit<UseQueryOptions<DigitalCertificate[]>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: signatureKeys.myCertificates(),
        queryFn: () => signatureService.getMyCertificates(),
        ...options,
    });
}

export function useCertificate(
    id: string,
    options?: Omit<UseQueryOptions<DigitalCertificate>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: signatureKeys.certificate(id),
        queryFn: () => signatureService.getCertificate(id),
        enabled: !!id,
        ...options,
    });
}

// ============================================================================
// TEMPLATES - QUERIES
// ============================================================================

export function useSignatureTemplates(
    filters?: {
        created_by?: string;
        is_active?: boolean;
        page?: number;
        page_size?: number;
    },
    options?: Omit<UseQueryOptions<PaginatedResponse<SignatureTemplate>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: signatureKeys.templatesList(filters),
        queryFn: () => signatureService.getSignatureTemplates(filters),
        ...options,
    });
}

export function useSignatureTemplate(
    id: string,
    options?: Omit<UseQueryOptions<SignatureTemplate>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: signatureKeys.template(id),
        queryFn: () => signatureService.getSignatureTemplate(id),
        enabled: !!id,
        ...options,
    });
}

// ============================================================================
// BATCHES - QUERIES
// ============================================================================

export function useSignatureBatches(
    filters?: {
        created_by?: string;
        status?: string;
        page?: number;
        page_size?: number;
    },
    options?: Omit<UseQueryOptions<PaginatedResponse<SignatureBatch>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: signatureKeys.batchesList(filters),
        queryFn: () => signatureService.getSignatureBatches(filters),
        ...options,
    });
}

export function useSignatureBatch(
    id: string,
    options?: Omit<UseQueryOptions<SignatureBatch>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: signatureKeys.batch(id),
        queryFn: () => signatureService.getSignatureBatch(id),
        enabled: !!id,
        ...options,
    });
}

export function useSignatureBatchStatus(
    id: string,
    options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: signatureKeys.batchStatus(id),
        queryFn: () => signatureService.getSignatureBatchStatus(id),
        enabled: !!id,
        refetchInterval: 10000, // Poll every 10s
        ...options,
    });
}

// ============================================================================
// AUDIT LOGS - QUERIES
// ============================================================================

export function useSignatureAuditLogs(
    filters?: {
        signature_request?: string;
        document_signature?: string;
        action_type?: string;
        user?: string;
        page?: number;
        page_size?: number;
    },
    options?: Omit<UseQueryOptions<PaginatedResponse<SignatureAuditLog>>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: signatureKeys.auditLogsList(filters),
        queryFn: () => signatureService.getSignatureAuditLogs(filters),
        ...options,
    });
}

export function useAuditLogsForRequest(
    requestId: string,
    options?: Omit<UseQueryOptions<SignatureAuditLog[]>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: signatureKeys.auditLogsForRequest(requestId),
        queryFn: () => signatureService.getAuditLogsForRequest(requestId),
        enabled: !!requestId,
        ...options,
    });
}

// ============================================================================
// SIGNATURE REQUESTS - MUTATIONS
// ============================================================================

export function useCreateSignatureRequest(
    options?: UseMutationOptions<SignatureRequest, Error, {
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
    }>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => signatureService.createSignatureRequest(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: signatureKeys.requests() });
            queryClient.invalidateQueries({ queryKey: signatureKeys.myRequests() });

            toast.success('Solicitação de assinatura criada');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao criar solicitação');
        },
        ...options,
    });
}

export function useCancelSignatureRequest(
    options?: UseMutationOptions<void, Error, string>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (requestId: string) => signatureService.cancelSignatureRequest(requestId),
        onSuccess: (_, requestId) => {
            queryClient.invalidateQueries({ queryKey: signatureKeys.request(requestId) });
            queryClient.invalidateQueries({ queryKey: signatureKeys.requests() });
            queryClient.invalidateQueries({ queryKey: signatureKeys.pendingRequests() });

            toast.success('Solicitação cancelada');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao cancelar solicitação');
        },
        ...options,
    });
}

export function useRemindSigners(
    options?: UseMutationOptions<void, Error, string>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (requestId: string) => signatureService.remindSigners(requestId),
        onSuccess: () => {
            toast.success('Lembretes enviados aos signatários');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao enviar lembretes');
        },
        ...options,
    });
}

// ============================================================================
// DOCUMENT SIGNATURES - MUTATIONS
// ============================================================================

export function useSignDocument(
    options?: UseMutationOptions<DocumentSignature, Error, {
        signer_id: string;
        certificate_id?: string;
        signature_image?: File;
        signature_text?: string;
        signature_type?: 'digital' | 'electronic' | 'handwritten';
    }>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => signatureService.signDocument(data),
        onSuccess: (signature, variables) => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: signatureKeys.documentSignatures() });
            queryClient.invalidateQueries({ queryKey: signatureKeys.signer(variables.signer_id) });
            queryClient.invalidateQueries({ queryKey: signatureKeys.pendingRequests() });

            // Invalidate request if we can get it from signer
            const signer = queryClient.getQueryData<SignatureRequestSigner>(
                signatureKeys.signer(variables.signer_id)
            );
            if (signer?.signature_request) {
                queryClient.invalidateQueries({ queryKey: signatureKeys.request(signer.signature_request) });
            }

            toast.success('Documento assinado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao assinar documento');
        },
        ...options,
    });
}

export function useRejectSignature(
    options?: UseMutationOptions<void, Error, {
        signer_id: string;
        reason: string;
    }>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ signer_id, reason }) => signatureService.rejectSignature(signer_id, reason),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: signatureKeys.signer(variables.signer_id) });
            queryClient.invalidateQueries({ queryKey: signatureKeys.requests() });
            queryClient.invalidateQueries({ queryKey: signatureKeys.pendingRequests() });

            toast.success('Assinatura recusada');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao recusar assinatura');
        },
        ...options,
    });
}

// ============================================================================
// CERTIFICATES - MUTATIONS
// ============================================================================

export function useUploadCertificate(
    options?: UseMutationOptions<DigitalCertificate, Error, {
        file: File;
        password: string;
        label?: string;
    }>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => signatureService.uploadCertificate(data.file, data.password, data.label),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: signatureKeys.certificates() });
            queryClient.invalidateQueries({ queryKey: signatureKeys.myCertificates() });

            toast.success('Certificado carregado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao carregar certificado');
        },
        ...options,
    });
}

export function useRevokeCertificate(
    options?: UseMutationOptions<void, Error, string>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (certificateId: string) => signatureService.revokeCertificate(certificateId),
        onSuccess: (_, certificateId) => {
            queryClient.invalidateQueries({ queryKey: signatureKeys.certificate(certificateId) });
            queryClient.invalidateQueries({ queryKey: signatureKeys.certificates() });
            queryClient.invalidateQueries({ queryKey: signatureKeys.myCertificates() });

            toast.success('Certificado revogado');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao revogar certificado');
        },
        ...options,
    });
}

// ============================================================================
// TEMPLATES - MUTATIONS
// ============================================================================

export function useCreateSignatureTemplate(
    options?: UseMutationOptions<SignatureTemplate, Error, {
        name: string;
        description?: string;
        default_signers?: any[];
        default_message?: string;
        default_deadline_days?: number;
    }>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => signatureService.createSignatureTemplate(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: signatureKeys.templates() });

            toast.success('Template criado');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao criar template');
        },
        ...options,
    });
}

export function useUpdateSignatureTemplate(
    options?: UseMutationOptions<SignatureTemplate, Error, {
        id: string;
        data: Partial<SignatureTemplate>;
    }>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => signatureService.updateSignatureTemplate(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: signatureKeys.template(variables.id) });
            queryClient.invalidateQueries({ queryKey: signatureKeys.templates() });

            toast.success('Template atualizado');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao atualizar template');
        },
        ...options,
    });
}

export function useDeleteSignatureTemplate(
    options?: UseMutationOptions<void, Error, string>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (templateId: string) => signatureService.deleteSignatureTemplate(templateId),
        onSuccess: (_, templateId) => {
            queryClient.removeQueries({ queryKey: signatureKeys.template(templateId) });
            queryClient.invalidateQueries({ queryKey: signatureKeys.templates() });

            toast.success('Template deletado');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao deletar template');
        },
        ...options,
    });
}

// ============================================================================
// BATCHES - MUTATIONS
// ============================================================================

export function useCreateSignatureBatch(
    options?: UseMutationOptions<SignatureBatch, Error, {
        name: string;
        description?: string;
        signature_requests: string[]; // Request IDs
    }>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => signatureService.createSignatureBatch(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: signatureKeys.batches() });

            toast.success('Lote de assinaturas criado');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao criar lote');
        },
        ...options,
    });
}

export function useProcessBatch(
    options?: UseMutationOptions<void, Error, string>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (batchId: string) => signatureService.processBatch(batchId),
        onSuccess: (_, batchId) => {
            queryClient.invalidateQueries({ queryKey: signatureKeys.batch(batchId) });
            queryClient.invalidateQueries({ queryKey: signatureKeys.batchStatus(batchId) });

            toast.success('Lote processado');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao processar lote');
        },
        ...options,
    });
}

export function useCancelBatch(
    options?: UseMutationOptions<void, Error, string>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (batchId: string) => signatureService.cancelBatch(batchId),
        onSuccess: (_, batchId) => {
            queryClient.invalidateQueries({ queryKey: signatureKeys.batch(batchId) });
            queryClient.invalidateQueries({ queryKey: signatureKeys.batches() });

            toast.success('Lote cancelado');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao cancelar lote');
        },
        ...options,
    });
}
