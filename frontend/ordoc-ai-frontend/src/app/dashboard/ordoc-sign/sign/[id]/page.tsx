'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import signatureService, { DigitalCertificate, SignatureAssignment, SignDocumentPayload } from '@/services/signature';

export default function SignDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const signerId = params.id as string;

  const { data: assignment, isLoading } = useQuery<SignatureAssignment>({
    queryKey: ['signature-assignment', signerId],
    queryFn: () => signatureService.getAssignment(signerId),
    enabled: !!signerId,
  });

  const { data: certificates } = useQuery<DigitalCertificate[]>({
    queryKey: ['my-certificates'],
    queryFn: () => signatureService.getMyCertificates(),
  });

  const [certificateId, setCertificateId] = useState<string>('');
  const [signatureData, setSignatureData] = useState<string>('');

  const mutation = useMutation({
    mutationFn: (payload: SignDocumentPayload) =>
      signatureService.signDocument(signerId, payload),
    onSuccess: () => router.push('/dashboard/ordoc-sign'),
  });

  if (!signerId) {
    return <p>ID inválido</p>;
  }

  if (isLoading || !assignment) {
    return <p>Carregando...</p>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ certificate_id: certificateId, signature_data: signatureData });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard/ordoc-sign" className="text-gray-500 hover:text-gray-700">
                  ← Voltar
                </Link>
                <div className="h-6 w-px bg-gray-300" />
                <h1 className="text-xl font-bold text-gray-900">Assinar Documento</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-lg font-semibold mb-4">{assignment.signature_request.title}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Assinatura (Base64)</label>
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
      </div>
    </ProtectedRoute>
  );
}
