'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { organizationsService } from '@/services/organizations';
import { Organization } from '@/components/ordoc-cloud/organizations/edit/types';

export default function EditOrganizationPage() {
  const params = useParams();
  const router = useRouter();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    corporate_name: '',
    cnpj: '',
    email: '',
    phone: '',
    contact_name: '',
    contact_phone: '',
    site: '',
    subdomain: '',
    prn: '',
    is_active: true
  });

  const organizationId = params.id as string;

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setLoading(true);
        const data = await organizationsService.getOrganization(organizationId);
        setOrganization(data);
        setFormData({
          corporate_name: data.corporateName || '',
          cnpj: data.cnpj || '',
          email: data.email || '',
          phone: data.phone || '',
          contact_name: data.contactName || '',
          contact_phone: data.contactPhone || '',
          site: data.site || '',
          subdomain: '',
          prn: '',
          is_active: true
        });
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar organização');
      } finally {
        setLoading(false);
      }
    };

    if (organizationId) {
      fetchOrganization();
    }
  }, [organizationId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      const updateData = {
        organization: {
          corporateName: formData.corporate_name,
          cnpj: formData.cnpj,
          email: formData.email,
          phone: formData.phone,
          contactName: formData.contact_name,
          contactPhone: formData.contact_phone,
          site: formData.site,
          logoUrl: '',
          storageLimit: '100',
          appIds: []
        },
        address: {
          street: '',
          number: '',
          complement: '',
          postalCode: '',
          city: '',
          state: '',
          neighborhood: ''
        }
      };
      await organizationsService.updateOrganization(organizationId, updateData);
      router.push(`/dashboard/ordoc-cloud/organizations/${organizationId}`);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar organização');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Voltar
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Organização</h1>
            <p className="text-gray-600">Atualize as informações da organização</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium">Erro</h3>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit} className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Informações da Organização</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="corporate_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Razão Social *
                </label>
                <input
                  type="text"
                  id="corporate_name"
                  name="corporate_name"
                  value={formData.corporate_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">
                  CNPJ *
                </label>
                <input
                  type="text"
                  id="cnpj"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Contato *
                </label>
                <input
                  type="text"
                  id="contact_name"
                  name="contact_name"
                  value={formData.contact_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone do Contato *
                </label>
                <input
                  type="tel"
                  id="contact_phone"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700 mb-1">
                  Subdomínio *
                </label>
                <input
                  type="text"
                  id="subdomain"
                  name="subdomain"
                  value={formData.subdomain}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="prn" className="block text-sm font-medium text-gray-700 mb-1">
                  PRN *
                </label>
                <input
                  type="text"
                  id="prn"
                  name="prn"
                  value={formData.prn}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="site" className="block text-sm font-medium text-gray-700 mb-1">
                  Site
                </label>
                <input
                  type="url"
                  id="site"
                  name="site"
                  value={formData.site}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Organização ativa
                  </label>
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
