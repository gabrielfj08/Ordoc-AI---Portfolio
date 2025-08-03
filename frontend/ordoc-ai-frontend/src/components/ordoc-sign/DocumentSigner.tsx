'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import signatureService, {
  DigitalCertificate,
  SignDocumentPayload,
  SignatureRequestSigner,
} from '@/services/signature';

interface DocumentSignerProps {
  assignmentId: string;
  onBack: () => void;
}

export default function DocumentSigner({ assignmentId, onBack }: DocumentSignerProps) {
  const { data: assignment, isLoading } = useQuery<SignatureRequestSigner>({
    queryKey: ['signature-assignment', assignmentId],
    queryFn: () => signatureService.getAssignment(assignmentId),
    enabled: !!assignmentId,
  });

  const { data: certificates } = useQuery<DigitalCertificate[]>({
    queryKey: ['my-certificates'],
    queryFn: () => signatureService.getMyCertificates(),
  });

  const [certificateId, setCertificateId] = useState('');
  const [signatureData, setSignatureData] = useState('');

  const mutation = useMutation({
    mutationFn: (payload: SignDocumentPayload) =>
      signatureService.signDocument(assignmentId, payload),
    onSuccess: onBack,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ certificate_id: certificateId, signature_data: signatureData });
  };

  if (isLoading || !assignment) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
          ← Voltar
        </button>
        <h2 className="text-xl font-bold text-gray-900">Assinar Documento</h2>
      </div>
      <h3 className="text-lg font-semibold">{assignment.signature_request.title}</h3>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-md shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Certificado</label>
          <select
            required
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="" disabled>
              Selecione
            </option>
            {certificates?.map((cert) => (
              <option key={cert.id} value={cert.id}>
                {cert.subject_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assinatura (Base64)
          </label>
          <textarea
            required
            value={signatureData}
            onChange={(e) => setSignatureData(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            rows={4}
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          {mutation.isPending ? 'Enviando...' : 'Assinar'}
        </button>
      </form>
    </div>
  );
}

