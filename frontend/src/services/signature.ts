import api from './auth';
import {
  DigitalCertificate,
  SignatureTemplate,
  SignatureRequest,
  SignatureRequestSigner,
  DocumentSignature,
  SignatureBatch,
  SignatureAuditLog,
  UploadCertificateData,
  CreateSignatureRequestData,
  CreateSignatureBatchData,
  SignDocumentPayload,
  CertificateVerificationResult,
  SignatureVerificationResult,
  FilterDigitalCertificatesParams,
  FilterSignatureTemplatesParams,
  FilterSignatureRequestsParams,
  FilterSignatureRequestSignersParams,
  FilterDocumentSignaturesParams,
  FilterSignatureBatchesParams,
  FilterSignatureAuditLogsParams,
  ApiResponse
} from '@/types/ordoc-sign';

class SignatureService {
  private base = '/api/v1/ordoc-sign/api';

  async getCertificates(params?: FilterDigitalCertificatesParams): Promise<ApiResponse<DigitalCertificate>> {
    const response = await api.get(`${this.base}/certificates/`, { params });
    return response.data;
  }

  async getCertificate(id: string): Promise<DigitalCertificate> {
    const response = await api.get(`${this.base}/certificates/${id}/`);
    return response.data;
  }

  async uploadCertificate(data: UploadCertificateData): Promise<DigitalCertificate> {
    const formData = new FormData();
    formData.append('certificate_file', data.certificate_file);
    formData.append('certificate_type', data.certificate_type);
    if (data.password) formData.append('password', data.password);
    if (data.is_default) formData.append('is_default', 'true');

    const response = await api.post(`${this.base}/certificates/upload/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async verifyCertificate(id: string): Promise<CertificateVerificationResult> {
    const response = await api.post(`${this.base}/certificates/${id}/verify/`);
    return response.data;
  }

  async setDefaultCertificate(id: string): Promise<any> {
    const response = await api.post(`${this.base}/certificates/${id}/set_default/`);
    return response.data;
  }

  async getMyCertificates(): Promise<DigitalCertificate[]> {
    const response = await api.get(`${this.base}/certificates/my_certificates/`);
    return response.data.results || response.data;
  }

  async deleteCertificate(id: string): Promise<any> {
    const response = await api.delete(`${this.base}/certificates/${id}/`);
    return response.data;
  }

  async getTemplates(params?: FilterSignatureTemplatesParams): Promise<ApiResponse<SignatureTemplate>> {
    const response = await api.get(`${this.base}/templates/`, { params });
    return response.data;
  }

  async getTemplate(id: string): Promise<SignatureTemplate> {
    const response = await api.get(`${this.base}/templates/${id}/`);
    return response.data;
  }

  async createTemplate(data: Partial<SignatureTemplate>): Promise<SignatureTemplate> {
    const response = await api.post(`${this.base}/templates/`, data);
    return response.data;
  }

  async updateTemplate(id: string, data: Partial<SignatureTemplate>): Promise<SignatureTemplate> {
    const response = await api.put(`${this.base}/templates/${id}/`, data);
    return response.data;
  }

  async deleteTemplate(id: string): Promise<any> {
    const response = await api.delete(`${this.base}/templates/${id}/`);
    return response.data;
  }

  async duplicateTemplate(id: string): Promise<SignatureTemplate> {
    const response = await api.post(`${this.base}/templates/${id}/duplicate/`);
    return response.data;
  }

  async getRequests(params?: FilterSignatureRequestsParams): Promise<ApiResponse<SignatureRequest>> {
    const response = await api.get(`${this.base}/requests/`, { params });
    return response.data;
  }

  async getRequest(id: string): Promise<SignatureRequest> {
    const response = await api.get(`${this.base}/requests/${id}/`);
    return response.data;
  }

  async createRequest(data: CreateSignatureRequestData): Promise<SignatureRequest> {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    formData.append('document_file', data.document_file);
    if (data.template_id) formData.append('template_id', data.template_id);
    if (data.expires_in_days) formData.append('expires_in_days', data.expires_in_days.toString());
    if (data.require_certificate) formData.append('require_certificate', 'true');
    if (data.allow_decline) formData.append('allow_decline', 'true');
    if (data.sequential_signing) formData.append('sequential_signing', 'true');
    formData.append('signers', JSON.stringify(data.signers));

    const response = await api.post(`${this.base}/requests/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async updateRequest(id: string, data: Partial<SignatureRequest>): Promise<SignatureRequest> {
    const response = await api.put(`${this.base}/requests/${id}/`, data);
    return response.data;
  }

  async deleteRequest(id: string): Promise<any> {
    const response = await api.delete(`${this.base}/requests/${id}/`);
    return response.data;
  }

  async submitRequest(id: string): Promise<any> {
    const response = await api.post(`${this.base}/requests/${id}/submit/`);
    return response.data;
  }

  async cancelRequest(id: string): Promise<any> {
    const response = await api.post(`${this.base}/requests/${id}/cancel/`);
    return response.data;
  }

  async getRequestSigners(id: string): Promise<SignatureRequestSigner[]> {
    const response = await api.get(`${this.base}/requests/${id}/signers/`);
    return response.data.results || response.data;
  }

  async getRequestSignatures(id: string): Promise<DocumentSignature[]> {
    const response = await api.get(`${this.base}/requests/${id}/signatures/`);
    return response.data.results || response.data;
  }

  async getMyRequests(): Promise<SignatureRequest[]> {
    const response = await api.get(`${this.base}/requests/my_requests/`);
    return response.data.results || response.data;
  }

  async getPendingRequests(): Promise<SignatureRequest[]> {
    const response = await api.get(`${this.base}/requests/pending/`);
    return response.data.results || response.data;
  }

  async getSigners(params?: FilterSignatureRequestSignersParams): Promise<ApiResponse<SignatureRequestSigner>> {
    const response = await api.get(`${this.base}/signers/`, { params });
    return response.data;
  }

  async getSigner(id: string): Promise<SignatureRequestSigner> {
    const response = await api.get(`${this.base}/signers/${id}/`);
    return response.data;
  }

  async getMyAssignments(): Promise<SignatureRequestSigner[]> {
    const response = await api.get(`${this.base}/signers/my_assignments/`);
    return response.data.results || response.data;
  }

  async getMySignedDocuments(): Promise<SignatureRequestSigner[]> {
    const response = await api.get(`${this.base}/signers/my_assignments/`, {
      params: { status: 'signed', ordering: '-signed_at' }
    });
    return response.data.results || response.data;
  }

  async getAssignment(id: string): Promise<SignatureRequestSigner> {
    const response = await api.get(`${this.base}/signers/${id}/`);
    return response.data;
  }

  async signDocument(id: string, data: SignDocumentPayload): Promise<any> {
    const response = await api.post(`${this.base}/signers/${id}/sign/`, data);
    return response.data;
  }

  async declineSigning(id: string, reason?: string): Promise<any> {
    const response = await api.post(`${this.base}/signers/${id}/decline/`, { reason });
    return response.data;
  }

  async getSignatures(params?: FilterDocumentSignaturesParams): Promise<ApiResponse<DocumentSignature>> {
    const response = await api.get(`${this.base}/signatures/`, { params });
    return response.data;
  }

  async getSignature(id: string): Promise<DocumentSignature> {
    const response = await api.get(`${this.base}/signatures/${id}/`);
    return response.data;
  }

  async verifySignature(id: string): Promise<SignatureVerificationResult> {
    const response = await api.post(`${this.base}/signatures/${id}/verify/`);
    return response.data;
  }

  async getSignatureStats(): Promise<any> {
    const response = await api.get(`${this.base}/signatures/stats/`);
    return response.data;
  }

  async getBatches(params?: FilterSignatureBatchesParams): Promise<ApiResponse<SignatureBatch>> {
    const response = await api.get(`${this.base}/batches/`, { params });
    return response.data;
  }

  async getBatch(id: string): Promise<SignatureBatch> {
    const response = await api.get(`${this.base}/batches/${id}/`);
    return response.data;
  }

  async createBatch(data: CreateSignatureBatchData): Promise<SignatureBatch> {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.template_id) formData.append('template_id', data.template_id);
    formData.append('requests', JSON.stringify(data.requests));

    const response = await api.post(`${this.base}/batches/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async processBatch(id: string): Promise<any> {
    const response = await api.post(`${this.base}/batches/${id}/process/`);
    return response.data;
  }

  async cancelBatch(id: string): Promise<any> {
    const response = await api.post(`${this.base}/batches/${id}/cancel/`);
    return response.data;
  }

  async getAuditLogs(params?: FilterSignatureAuditLogsParams): Promise<ApiResponse<SignatureAuditLog>> {
    const response = await api.get(`${this.base}/audit-logs/`, { params });
    return response.data;
  }
}

export const signatureService = new SignatureService();
export default signatureService;

export type { 
  DigitalCertificate,
  SignatureTemplate,
  SignatureRequest,
  SignatureRequestSigner as SignatureAssignment,
  DocumentSignature,
  SignatureBatch,
  SignatureAuditLog,
  SignDocumentPayload,
  UploadCertificateData,
  CreateSignatureRequestData,
  CreateSignatureBatchData
} from '@/types/ordoc-sign';
