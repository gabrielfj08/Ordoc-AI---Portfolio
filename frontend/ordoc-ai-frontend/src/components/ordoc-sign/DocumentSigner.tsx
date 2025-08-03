'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import signatureService from '@/services/signature';
import {
  DigitalCertificate,
  SignDocumentPayload,
  SignatureRequestSigner,
} from '@/types/ordoc-sign';

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
    return (
      <p
        aria-live="polite"
        className="flex items-center gap-2 text-gray-600"
      >
        <svg
          className="h-5 w-5 animate-spin text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        Carregando / Loading...
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          ← Voltar / Back
        </button>
        <h2 className="text-xl font-bold text-gray-900">Assinar Documento / Sign Document</h2>
      </div>
      <h3 className="text-lg font-semibold">{assignment.signature_request.title}</h3>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-4 rounded-md shadow"
        aria-busy={mutation.isPending}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Certificado / Certificate
          </label>
          <select
            required
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Selecione / Select
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
            Assinatura (Base64) / Signature (Base64)
          </label>
          <textarea
            required
            value={signatureData}
            onChange={(e) => setSignatureData(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Assinar / Sign"
        >
          {mutation.isPending && (
            <svg
              className="h-4 w-4 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
          {mutation.isPending ? 'Enviando / Signing...' : 'Assinar / Sign'}
        </button>
      </form>
    </div>
  );
}

