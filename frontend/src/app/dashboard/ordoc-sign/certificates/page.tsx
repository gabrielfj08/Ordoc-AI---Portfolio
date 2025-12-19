'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Upload, Shield, CheckCircle, XCircle, AlertTriangle, Star } from 'lucide-react';
import { DocumentCheckIcon } from '@heroicons/react/24/outline';
import EmptyState from '@/components/ui/EmptyState';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { signatureService } from '@/services/signature';
import { FilterDigitalCertificatesParams } from '@/types/ordoc-sign';
import ErrorState from '@/components/ui/ErrorState';

export default function CertificatesPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterDigitalCertificatesParams>({
    page: 1,
    page_size: 20
  });

  const { data: certificatesData, isLoading, error, refetch } = useQuery({
    queryKey: ['certificates', filters],
    queryFn: () => signatureService.getCertificates(filters),
  });

  const certificates = certificatesData?.results || [];

  const handleVerifyCertificate = async (id: string) => {
    try {
      const result = await signatureService.verifyCertificate(id);
      alert(`Certificado ${result.is_valid ? 'válido' : 'inválido'}: ${result.message}`);
    } catch (error) {
      console.error('Erro ao verificar certificado:', error);
      alert('Erro ao verificar certificado. Tente novamente.');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await signatureService.setDefaultCertificate(id);
      refetch();
    } catch (error) {
      console.error('Erro ao definir certificado padrão:', error);
      alert('Erro ao definir certificado padrão. Tente novamente.');
    }
  };

  const handleDeleteCertificate = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este certificado?')) return;
    
    try {
      await signatureService.deleteCertificate(id);
      refetch();
    } catch (error) {
      console.error('Erro ao excluir certificado:', error);
      alert('Erro ao excluir certificado. Tente novamente.');
    }
  };

  const getStatusIcon = (status: string, isExpired: boolean) => {
    if (isExpired) return <XCircle className="w-5 h-5 text-red-500" />;
    
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'expired':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'revoked':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'suspended':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string, isExpired: boolean) => {
    if (isExpired) return 'Expirado';
    
    switch (status) {
      case 'active': return 'Ativo';
      case 'expired': return 'Expirado';
      case 'revoked': return 'Revogado';
      case 'suspended': return 'Suspenso';
      default: return status;
    }
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
                <h1 className="text-xl font-bold text-gray-900">Certificados Digitais</h1>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => refetch()}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Atualizar
                </button>
                <Link
                  href="/dashboard/ordoc-sign/certificates/new"
                  className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Certificado</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Carregando certificados...</span>
            </div>
          ) : error ? (
            <ErrorState message="Erro ao conectar com o servidor" />
          ) : certificates.length === 0 ? (
            <EmptyState
              icon={DocumentCheckIcon}
              title="Nenhum certificado configurado"
              description="Importe ou crie certificados para assinar documentos"
              actionButton={{ text: 'Importar Certificado', onClick: () => router.push('/dashboard/ordoc-sign/certificates/new') }}
            />
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Certificado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Validade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Último Uso
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {certificates.map((certificate) => (
                      <tr key={certificate.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {certificate.is_default && (
                              <Star className="w-4 h-4 text-yellow-500 mr-2" />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {certificate.subject_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {certificate.issuer_name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {certificate.certificate_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(certificate.status, certificate.is_expired)}
                            <span className="ml-2 text-sm text-gray-900">
                              {getStatusText(certificate.status, certificate.is_expired)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(certificate.valid_until).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {certificate.last_used_at 
                            ? new Date(certificate.last_used_at).toLocaleDateString('pt-BR')
                            : 'Nunca'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleVerifyCertificate(certificate.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Verificar
                          </button>
                          {!certificate.is_default && (
                            <button
                              onClick={() => handleSetDefault(certificate.id)}
                              className="text-green-600 hover:text-green-800"
                            >
                              Definir Padrão
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteCertificate(certificate.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
