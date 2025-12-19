export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
}

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface DigitalCertificate extends BaseEntity {
  certificate_type: 'A1' | 'A3' | 'ICP_BRASIL' | 'SELF_SIGNED';
  subject_name: string;
  issuer_name: string;
  serial_number: string;
  valid_from: string;
  valid_until: string;
  status: 'active' | 'expired' | 'revoked' | 'suspended';
  is_default: boolean;
  is_expired: boolean;
  last_used_at?: string;
  certificate_data: string;
  organization_id: number;
  user_id: number;
}

export interface SignatureTemplate extends BaseEntity {
  name: string;
  description?: string;
  template_type: 'simple' | 'advanced' | 'qualified';
  status: 'active' | 'inactive' | 'draft';
  signature_fields: Record<string, any>;
  validation_rules: Record<string, any>;
  appearance_config: Record<string, any>;
  workflow_config: Record<string, any>;
  organization_id: number;
  created_by_id: number;
}

export interface SignatureRequest extends BaseEntity {
  title: string;
  description?: string;
  document_name: string;
  document_url: string;
  template_id?: string;
  template_name?: string;
  status: 'draft' | 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'expired';
  expires_at?: string;
  require_certificate: boolean;
  allow_decline: boolean;
  sequential_signing: boolean;
  organization_id: number;
  created_by_id: number;
}

export interface SignatureRequestSigner extends BaseEntity {
  request_id: string;
  email: string;
  full_name: string;
  signing_order: number;
  status: 'pending' | 'signed' | 'declined' | 'expired';
  require_certificate: boolean;
  can_sign: boolean;
  signing_url?: string;
  signed_at?: string;
  declined_at?: string;
  decline_reason?: string;
  signature_request: {
    id: string;
    title: string;
    document_name: string;
  };
}

export interface DocumentSignature extends BaseEntity {
  request_id: string;
  signer_id: string;
  certificate_id?: string;
  signature_data: string;
  signing_reason?: string;
  signing_location?: string;
  contact_info?: string;
  page_number?: number;
  position_x?: number;
  position_y?: number;
  width?: number;
  height?: number;
  signature_hash: string;
  timestamp: string;
  is_valid: boolean;
}

export interface SignatureBatch extends BaseEntity {
  name: string;
  description?: string;
  template_id?: string;
  template_name?: string;
  status: 'draft' | 'processing' | 'completed' | 'failed' | 'cancelled';
  total_requests: number;
  completed_requests: number;
  failed_requests: number;
  progress_percentage: number;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  organization_id: number;
  created_by_id: number;
}

export interface SignatureAuditLog extends BaseEntity {
  request_id?: string;
  signer_id?: string;
  signature_id?: string;
  action: string;
  description: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  organization_id: number;
  user_id?: number;
}

export interface FilterDigitalCertificatesParams extends PaginationParams {
  certificate_type?: 'A1' | 'A3' | 'ICP_BRASIL' | 'SELF_SIGNED' | '';
  status?: 'active' | 'expired' | 'revoked' | 'suspended' | '';
  is_default?: boolean;
  expires_before?: string;
  expires_after?: string;
}

export interface FilterSignatureTemplatesParams extends PaginationParams {
  template_type?: 'simple' | 'advanced' | 'qualified' | '';
  status?: 'active' | 'inactive' | 'draft' | '';
}

export interface FilterSignatureRequestsParams extends PaginationParams {
  template_id?: string;
  status?: 'draft' | 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'expired' | '';
  created_after?: string;
  created_before?: string;
  expires_before?: string;
}

export interface FilterSignatureRequestSignersParams extends PaginationParams {
  request_id?: string;
  status?: 'pending' | 'signed' | 'declined' | 'expired' | '';
  email?: string;
}

export interface FilterDocumentSignaturesParams extends PaginationParams {
  request_id?: string;
  signer_id?: string;
  certificate_id?: string;
  is_valid?: boolean;
}

export interface FilterSignatureBatchesParams extends PaginationParams {
  template_id?: string;
  status?: 'draft' | 'processing' | 'completed' | 'failed' | 'cancelled' | '';
  created_after?: string;
  created_before?: string;
}

export interface FilterSignatureAuditLogsParams extends PaginationParams {
  request_id?: string;
  signer_id?: string;
  action?: string;
  created_after?: string;
  created_before?: string;
}

export interface UploadCertificateData {
  certificate_file: File;
  password?: string;
  certificate_type: 'A1' | 'A3' | 'ICP_BRASIL' | 'SELF_SIGNED';
  is_default?: boolean;
}

export interface CreateSignatureRequestData {
  title: string;
  description?: string;
  document_file: File;
  template_id?: string;
  expires_in_days?: number;
  require_certificate?: boolean;
  allow_decline?: boolean;
  sequential_signing?: boolean;
  signers: Array<{
    email: string;
    full_name: string;
    signing_order: number;
    require_certificate?: boolean;
  }>;
}

export interface CreateSignatureBatchData {
  name: string;
  description?: string;
  template_id?: string;
  requests: Array<{
    title: string;
    document_file: File;
    signers: Array<{
      email: string;
      full_name: string;
      signing_order: number;
    }>;
  }>;
}

export interface SignDocumentPayload {
  certificate_id: string;
  signature_data: string;
  signing_reason?: string;
  signing_location?: string;
  contact_info?: string;
  page_number?: number;
  position_x?: number;
  position_y?: number;
  width?: number;
  height?: number;
}

export interface CertificateVerificationResult {
  is_valid: boolean;
  message: string;
  details: {
    certificate_type: string;
    subject_name: string;
    issuer_name: string;
    valid_from: string;
    valid_until: string;
    status: string;
    is_expired: boolean;
    days_until_expiry: number | null;
  };
}

export interface SignatureVerificationResult {
  is_valid: boolean;
  message: string;
  details: {
    signature_hash: string;
    timestamp: string;
    certificate_info: {
      subject_name: string;
      issuer_name: string;
      valid_until: string;
    };
  };
}

export interface FormErrors {
  [key: string]: string;
}
