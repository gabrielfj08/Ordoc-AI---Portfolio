'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { signatureService } from '@/services/signature';
import { UploadCertificateData, FormErrors } from '@/types/ordoc-sign';

export default function NewCertificatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [dragActive, setDragActive] = useState(false);
  
  const [formData, setFormData] = useState<Omit<UploadCertificateData, 'certificate_file'> & { certificate_file?: File }>({
    certificate_type: 'A1',
    password: '',
    is_default: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (file: File) => {
    setFormData(prev => ({ ...prev, certificate_file: file }));
    if (errors.certificate_file) {
      setErrors(prev => ({ ...prev, certificate_file: '' }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.certificate_file) {
      newErrors.certificate_file = 'Arquivo de certificado é obrigatório';
    } else {
      const allowedExtensions = ['.p12', '.pfx', '.pem', '.crt', '.cer'];
      const fileExtension = '.' + formData.certificate_file.name.split('.').pop()?.toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        newErrors.certificate_file = 'Formato de arquivo não suportado. Use: .p12, .pfx, .pem, .crt, .cer';
      }
    }

    if (!formData.certificate_type) {
      newErrors.certificate_type = 'Tipo de certificado é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !formData.certificate_file) {
      return;
    }

    setLoading(true);
    
    try {
      const uploadData: UploadCertificateData = {
        certificate_file: formData.certificate_file,
        certificate_type: formData.certificate_type,
        password: formData.password || undefined,
        is_default: formData.is_default,
      };

      await signatureService.uploadCertificate(uploadData);
      router.push('/dashboard/ordoc-sign/certificates');
    } catch (error: any) {
      console.error('Erro ao fazer upload do certificado:', error);
      if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
      } else {
        setErrors({ general: 'Erro interno do servidor. Tente novamente.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/ordoc-sign/certificates');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Upload de Certificado</h1>
            <p className="text-gray-600">Faça upload de um novo certificado digital</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{errors.general}</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Arquivo do Certificado
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arquivo do Certificado *
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center ${
                    dragActive 
                      ? 'border-blue-400 bg-blue-50' 
                      : errors.certificate_file 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".p12,.pfx,.pem,.crt,.cer"
                    onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  {formData.certificate_file ? (
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formData.certificate_file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(formData.certificate_file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600">
                        Arraste e solte o arquivo aqui ou clique para selecionar
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Formatos suportados: .p12, .pfx, .pem, .crt, .cer
                      </p>
                    </div>
                  )}
                </div>
                {errors.certificate_file && (
                  <p className="mt-1 text-sm text-red-600">{errors.certificate_file}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="certificate_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Certificado *
                  </label>
                  <select
                    id="certificate_type"
                    name="certificate_type"
                    value={formData.certificate_type}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.certificate_type ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="A1">A1 - Arquivo</option>
                    <option value="A3">A3 - Token/Cartão</option>
                    <option value="ICP_BRASIL">ICP-Brasil</option>
                    <option value="SELF_SIGNED">Auto-assinado</option>
                  </select>
                  {errors.certificate_type && (
                    <p className="mt-1 text-sm text-red-600">{errors.certificate_type}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Senha do Certificado
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Digite a senha (se necessário)"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Necessário para certificados A1 protegidos por senha
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_default"
                  name="is_default"
                  checked={formData.is_default}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_default" className="ml-2 block text-sm text-gray-900">
                  Definir como certificado padrão
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Fazendo Upload...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Fazer Upload
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
