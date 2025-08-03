'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
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
  const [certificateType, setCertificateType] = useState('A1');

  const uploadMutation = useMutation({
    mutationFn: (data: UploadCertificateData) =>
      signatureService.uploadCertificate(data),
    onSuccess: () => {
      setFile(null);
      setPassword('');
      setIsDefault(false);
      refetch();
    },
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
      alert(`Certificado ${result.is_valid ? 'válido' : 'inválido'}: ${result.message}`);
    } catch (err) {
      console.error(err);
      alert('Erro ao verificar certificado');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await signatureService.setDefaultCertificate(id);
      refetch();
    } catch (err) {
      console.error(err);
      alert('Erro ao definir padrão');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir certificado?')) return;
    try {
      await signatureService.deleteCertificate(id);
      refetch();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir certificado');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
          ← Voltar
        </button>
        <h2 className="text-xl font-bold text-gray-900">Certificados Digitais</h2>
      </div>

      <form onSubmit={handleUpload} className="space-y-4 bg-white p-4 rounded-md shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Arquivo do Certificado
          </label>
          <input
            required
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            value={certificateType}
            onChange={(e) => setCertificateType(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="A1">A1</option>
            <option value="A3">A3</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="flex items-center">
          <input
            id="isDefault"
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
            Definir como padrão
          </label>
        </div>
        <button
          type="submit"
          disabled={uploadMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          {uploadMutation.isPending ? 'Enviando...' : 'Upload'}
        </button>
      </form>

      <div className="bg-white shadow rounded-md overflow-hidden">
        {isLoading ? (
          <p className="p-4">Carregando certificados...</p>
        ) : certificates && certificates.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certificado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
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
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Verificar
                    </button>
                    {!cert.is_default && (
                      <button
                        onClick={() => handleSetDefault(cert.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Padrão
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(cert.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-4 text-sm text-gray-500">Nenhum certificado encontrado.</p>
        )}
      </div>
    </div>
  );
}

