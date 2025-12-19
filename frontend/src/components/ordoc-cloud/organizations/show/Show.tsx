'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, BuildingOfficeIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';
import { ShowOrganizationProps, StorageUsageData } from './types';

const ShowOrganization = ({ organization }: ShowOrganizationProps) => {

  const [storageData, setStorageData] = React.useState<StorageUsageData>({
    ordocAir: 0,
    ordocFlow: 0,
    ordocSign: 0,
    ordocReports: 0,
    total: 0,
    available: 0,
  });

  // Mock storage data - in real implementation, this would come from API
  React.useEffect(() => {
    const mockStorageData: StorageUsageData = {
      ordocAir: 25.5,
      ordocFlow: 15.2,
      ordocSign: 8.3,
      ordocReports: 12.1,
      total: 61.1,
      available: Number(organization.storageLimit) - 61.1,
    };
    setStorageData(mockStorageData);
  }, [organization.storageLimit]);

  const storagePercentage = (storageData.total / Number(organization.storageLimit)) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/organizations"
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              
              {/* Organization Avatar */}
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="text-lg font-semibold text-white">
                    {organization.corporateName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {organization.corporateName}
                </h1>
                {organization.cnpj && (
                  <p className="text-sm text-gray-500">CNPJ: {organization.cnpj}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                href={`/dashboard/organizations/${organization.id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Editar
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Organization Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center mb-4">
                <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Informações da Organização</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Razão Social
                  </label>
                  <p className="text-sm text-gray-900">{organization.corporateName}</p>
                </div>
                
                {organization.cnpj && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CNPJ
                    </label>
                    <p className="text-sm text-gray-900">{organization.cnpj}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail
                  </label>
                  <p className="text-sm text-gray-900">{organization.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <p className="text-sm text-gray-900">{organization.phone}</p>
                </div>
                
                {organization.site && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Site
                    </label>
                    <a 
                      href={organization.site} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {organization.site}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center mb-4">
                <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Contato Responsável</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Responsável
                  </label>
                  <p className="text-sm text-gray-900">{organization.contactName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone do Responsável
                  </label>
                  <p className="text-sm text-gray-900">{organization.contactPhone}</p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center mb-4">
                <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Endereço</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logradouro
                  </label>
                  <p className="text-sm text-gray-900">
                    {organization.address.street}, {organization.address.number}
                  </p>
                </div>
                
                {organization.address.complement && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complemento
                    </label>
                    <p className="text-sm text-gray-900">{organization.address.complement}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro
                  </label>
                  <p className="text-sm text-gray-900">{organization.address.neighborhood}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP
                  </label>
                  <p className="text-sm text-gray-900">{organization.address.postalCode}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade
                  </label>
                  <p className="text-sm text-gray-900">{organization.address.city}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <p className="text-sm text-gray-900">{organization.address.state}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Storage and Apps */}
          <div className="space-y-6">
            
            {/* Storage Usage */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Uso de Armazenamento</h2>
              
              {/* Storage Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{storageData.total.toFixed(1)} GB usados</span>
                  <span>{organization.storageLimit} GB total</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {storagePercentage.toFixed(1)}% utilizado
                </div>
              </div>

              {/* Storage Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">OrdocAir</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {storageData.ordocAir.toFixed(1)} GB
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">OrdocFlow</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {storageData.ordocFlow.toFixed(1)} GB
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">OrdocSign</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {storageData.ordocSign.toFixed(1)} GB
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">OrdocReports</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {storageData.ordocReports.toFixed(1)} GB
                  </span>
                </div>
              </div>
            </div>

            {/* Active Apps */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Aplicações Ativas</h2>
              
              <div className="space-y-3">
                {organization.apps && organization.apps.length > 0 ? (
                  organization.apps.map((app) => (
                    <div key={app.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-xs font-medium text-blue-600">
                            {app.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{app.name}</span>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Ativo
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Nenhuma aplicação ativa</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowOrganization;
