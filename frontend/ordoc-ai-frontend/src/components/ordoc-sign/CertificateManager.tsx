'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import signatureService, {
  DigitalCertificate,
  UploadCertificateData,
} from '@/services/signature';

interface CertificateManagerProps {
  onBack: () => void;
}

export default function CertificateManager({ onBack }: CertificateManagerProps) {
  const { data: certificates, isLoading, refetch } = useQuery<DigitalCertificate[]>({
    queryKey: ['my-certificates'],
    queryFn: () => signatureService.getMyCertificates(),
  });

  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [certificateType, setCertificateType] = useState<'A1' | 'A3' | 'ICP_BRASIL' | 'SELF_SIGNED'>('A1');

  const uploadMutation = useMutation({
    mutationFn: (data: UploadCertificateData) =>
      signatureService.uploadCertificate(data),
    onSuccess: () => {
      setFile(null);
      setPassword('');
      setIsDefault(false);
      refetch();
      toast.success('Certificado enviado com sucesso');
    },
    onError: () => toast.error('Erro ao enviar certificado'),
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    uploadMutation.mutate({
      certificate_file: file,
      certificate_type: certificateType,
      password,
      is_default: isDefault,
    });
  };

  const handleVerify = async (id: string) => {
    try {
      const result = await signatureService.verifyCertificate(id);
      if (result.is_valid) {
        toast.success(`Certificado válido: ${result.message}`);
      } else {
        toast.error(`Certificado inválido: ${result.message}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao verificar certificado');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await signatureService.setDefaultCertificate(id);
      refetch();
      toast.success('Certificado definido como padrão');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao definir padrão');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir certificado?')) return;
    try {
      await signatureService.deleteCertificate(id);
      refetch();
      toast.success('Certificado excluído');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir certificado');
    }
  };

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
        <h2 className="text-xl font-bold text-gray-900">Certificados Digitais / Digital Certificates</h2>
      </div>

      <form
        onSubmit={handleUpload}
        className="space-y-4 bg-white p-4 rounded-md shadow"
        aria-busy={uploadMutation.isPending}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Arquivo do Certificado / Certificate File
          </label>
          <input
            required
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo / Type
          </label>
          <select
            value={certificateType}
            onChange={(e) => setCertificateType(e.target.value as 'A1' | 'A3' | 'ICP_BRASIL' | 'SELF_SIGNED')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="A1">A1</option>
            <option value="A3">A3</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Senha / Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center">
          <input
            id="isDefault"
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
            Definir como padrão / Set as default
          </label>
        </div>
        <button
          type="submit"
          disabled={uploadMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Upload"
        >
          {uploadMutation.isPending && (
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
          {uploadMutation.isPending ? 'Enviando / Uploading...' : 'Upload / Enviar'}
        </button>
      </form>

      <div className="bg-white shadow rounded-md overflow-hidden">
        {isLoading ? (
          <p className="p-4" aria-live="polite">
            Carregando certificados / Loading certificates...
          </p>
        ) : certificates && certificates.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Certificado / Certificate
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ações / Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {certificates.map((cert) => (
                <tr key={cert.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{cert.subject_name}</td>
                  <td className="px-6 py-4 space-x-2 text-sm">
                    <button
                      onClick={() => handleVerify(cert.id)}
                      className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      aria-label="Verificar / Verify"
                    >
                      Verificar / Verify
                    </button>
                    {!cert.is_default && (
                      <button
                        onClick={() => handleSetDefault(cert.id)}
                        className="text-green-600 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        aria-label="Padrão / Default"
                      >
                        Padrão / Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(cert.id)}
                      className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      aria-label="Excluir / Delete"
                    >
                      Excluir / Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-4 text-sm text-gray-500">
            Nenhum certificado encontrado / No certificate found.
          </p>
        )}
      </div>
    </div>
  );
}

