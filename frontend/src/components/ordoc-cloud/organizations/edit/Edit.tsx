'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { EditOrganizationProps, EditOrganizationFormValues } from './types';
import organizationsService from '@/services/organizations';

const EditOrganization = ({ data, onSubmit }: EditOrganizationProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [availableApps, setAvailableApps] = React.useState<Array<{ id: number; name: string; service: string }>>([]);
  
  const [formData, setFormData] = React.useState<EditOrganizationFormValues>({
    organization: {
      corporateName: data.corporateName,
      cnpj: data.cnpj,
      email: data.email,
      phone: data.phone,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      site: data.site,
      logoUrl: data.logoUrl,
      storageLimit: data.storageLimit,
      appIds: data.apps?.map((app) => app.id) || [],
    },
    address: {
      street: data.address.street,
      number: data.address.number,
      complement: data.address.complement,
      postalCode: data.address.postalCode,
      city: data.address.city,
      state: data.address.state,
      neighborhood: data.address.neighborhood,
    },
  });

  // Fetch available apps on component mount
  React.useEffect(() => {
    const fetchApps = async () => {
      try {
        const apps = await organizationsService.getAvailableApps();
        setAvailableApps(apps);
      } catch (error) {
        console.error('Error fetching available apps:', error);
        // Fallback to default apps
        setAvailableApps([
          { id: 1, name: 'OrdocAir', service: 'ordoc_air' },
          { id: 2, name: 'OrdocFlow', service: 'ordoc_flow' },
          { id: 3, name: 'OrdocSign', service: 'ordoc_sign' },
          { id: 4, name: 'OrdocReports', service: 'ordoc_reports' },
        ]);
      }
    };

    fetchApps();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    const keys = field.split('.');
    if (keys.length === 2) {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0] as keyof EditOrganizationFormValues],
          [keys[1]]: value
        }
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Organization validation
    if (!formData.organization.corporateName.trim()) {
      newErrors['organization.corporateName'] = 'Campo obrigatório';
    }
    if (!formData.organization.email.trim()) {
      newErrors['organization.email'] = 'Campo obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.organization.email)) {
      newErrors['organization.email'] = 'E-mail válido';
    }
    if (!formData.organization.phone.trim()) {
      newErrors['organization.phone'] = 'Campo obrigatório';
    }
    if (!formData.organization.contactName.trim()) {
      newErrors['organization.contactName'] = 'Campo obrigatório';
    }
    if (!formData.organization.contactPhone.trim()) {
      newErrors['organization.contactPhone'] = 'Campo obrigatório';
    }

    // Address validation
    if (!formData.address.street.trim()) {
      newErrors['address.street'] = 'Campo obrigatório';
    }
    if (!formData.address.postalCode.trim()) {
      newErrors['address.postalCode'] = 'Campo obrigatório';
    }
    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'Campo obrigatório';
    }
    if (!formData.address.state.trim()) {
      newErrors['address.state'] = 'Campo obrigatório';
    }
    if (!formData.address.neighborhood.trim()) {
      newErrors['address.neighborhood'] = 'Campo obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Show success message (in real implementation, use a toast/notification system)
      alert('Instituição atualizada com sucesso');
      router.push(`/dashboard/organizations/${data.id}`);
    } catch (error: any) {
      // Show error message
      alert(error?.message || 'Erro ao atualizar instituição');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppToggle = (appId: number) => {
    setFormData(prev => ({
      ...prev,
      organization: {
        ...prev.organization,
        appIds: prev.organization.appIds.includes(appId)
          ? prev.organization.appIds.filter(id => id !== appId)
          : [...prev.organization.appIds, appId]
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Editar Organização</h1>
          <p className="text-gray-600 mt-1">Atualize as informações da organização</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Organization Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Informações da Organização</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Corporativo *
                </label>
                <input
                  type="text"
                  value={formData.organization.corporateName}
                  onChange={(e) => handleInputChange('organization.corporateName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome da empresa"
                />
                {errors['organization.corporateName'] && (
                  <p className="text-red-500 text-sm mt-1">*{errors['organization.corporateName']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail *
                </label>
                <input
                  type="email"
                  value={formData.organization.email}
                  onChange={(e) => handleInputChange('organization.email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@empresa.com"
                />
                {errors['organization.email'] && (
                  <p className="text-red-500 text-sm mt-1">*{errors['organization.email']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone *
                </label>
                <input
                  type="tel"
                  value={formData.organization.phone}
                  onChange={(e) => handleInputChange('organization.phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(11) 99999-9999"
                />
                {errors['organization.phone'] && (
                  <p className="text-red-500 text-sm mt-1">*{errors['organization.phone']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site
                </label>
                <input
                  type="url"
                  value={formData.organization.site}
                  onChange={(e) => handleInputChange('organization.site', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://www.empresa.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Contato *
                </label>
                <input
                  type="text"
                  value={formData.organization.contactName}
                  onChange={(e) => handleInputChange('organization.contactName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome do responsável"
                />
                {errors['organization.contactName'] && (
                  <p className="text-red-500 text-sm mt-1">*{errors['organization.contactName']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone do Contato *
                </label>
                <input
                  type="tel"
                  value={formData.organization.contactPhone}
                  onChange={(e) => handleInputChange('organization.contactPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(11) 99999-9999"
                />
                {errors['organization.contactPhone'] && (
                  <p className="text-red-500 text-sm mt-1">*{errors['organization.contactPhone']}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Endereço</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rua *
                </label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome da rua"
                />
                {errors['address.street'] && (
                  <p className="text-red-500 text-sm mt-1">*{errors['address.street']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número
                </label>
                <input
                  type="text"
                  value={formData.address.number}
                  onChange={(e) => handleInputChange('address.number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Complemento
                </label>
                <input
                  type="text"
                  value={formData.address.complement}
                  onChange={(e) => handleInputChange('address.complement', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Apartamento, sala, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CEP *
                </label>
                <input
                  type="text"
                  value={formData.address.postalCode}
                  onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="00000-000"
                />
                {errors['address.postalCode'] && (
                  <p className="text-red-500 text-sm mt-1">*{errors['address.postalCode']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bairro *
                </label>
                <input
                  type="text"
                  value={formData.address.neighborhood}
                  onChange={(e) => handleInputChange('address.neighborhood', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome do bairro"
                />
                {errors['address.neighborhood'] && (
                  <p className="text-red-500 text-sm mt-1">*{errors['address.neighborhood']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome da cidade"
                />
                {errors['address.city'] && (
                  <p className="text-red-500 text-sm mt-1">*{errors['address.city']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="SP"
                />
                {errors['address.state'] && (
                  <p className="text-red-500 text-sm mt-1">*{errors['address.state']}</p>
                )}
              </div>
            </div>
          </div>

          {/* Apps Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Aplicações</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {availableApps.map((app) => (
                <label key={app.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.organization.appIds.includes(app.id)}
                    onChange={() => handleAppToggle(app.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{app.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Storage Limit */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Armazenamento Cloud</h2>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={formData.organization.storageLimit}
                onChange={(e) => handleInputChange('organization.storageLimit', e.target.value)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="100"
                min="1"
              />
              <span className="text-sm font-medium text-gray-700">GiB</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrganization;
