import api from './auth';

export interface DigitalCertificate {
  id: string;
  certificate_type: string;
  subject_name: string;
  issuer_name: string;
  valid_from: string;
  valid_until: string;
  is_default: boolean;
  is_expired: boolean;
}

export interface SignatureRequestInfo {
  id: string;
  title: string;
  document_name: string;
}

export interface SignatureAssignment {
  id: string;
  email: string;
  full_name: string;
  signing_order: number;
  status: string;
  require_certificate: boolean;
  can_sign: boolean;
  signing_url: string | null;
  signature_request: SignatureRequestInfo;
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

class SignatureService {
  private base = '/api/v1/ordoc-sign/api';

  async getMyAssignments(): Promise<SignatureAssignment[]> {
    const response = await api.get(`${this.base}/signers/my_assignments/`);
    return response.data.results || response.data;
  }

  async getAssignment(id: string): Promise<SignatureAssignment> {
    const response = await api.get(`${this.base}/signers/${id}/`);
    return response.data;
  }

  async signDocument(id: string, data: SignDocumentPayload): Promise<any> {
    const response = await api.post(`${this.base}/signers/${id}/sign/`, data);
    return response.data;
  }

  async getMyCertificates(): Promise<DigitalCertificate[]> {
    const response = await api.get(`${this.base}/certificates/my_certificates/`);
    return response.data.results || response.data;
  }
}

export const signatureService = new SignatureService();
export default signatureService;
