'use client';

import * as React from 'react';
import { Phone, Mail, Home } from 'lucide-react';
import { phoneMask } from '@/utils/ordoc-cidadao';

interface OrganizationData {
  logoUrl: string;
  corporateName: string;
  contactPhone: string;
  email: string;
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}

interface SessionData {
  organization: OrganizationData;
}

const OrganizationFooter = () => {
  // Mock session data - substituir por hook real
  const session: SessionData = {
    organization: {
      logoUrl: '/logo-placeholder.png',
      corporateName: 'Organização Municipal',
      contactPhone: '11999999999',
      email: 'contato@organizacao.gov.br',
      address: {
        street: 'Rua Principal',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP'
      }
    }
  };

  if (!session.organization) return null;

  return (
    <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-blue-600">
          Dúvidas ou sugestões?
        </h3>
        <h4 className="text-xl font-bold text-blue-600">
          Entre em contato conosco!
        </h4>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8">
        <div className="flex items-center space-x-4">
          <div className="h-24 w-24 flex-shrink-0">
            <img 
              src={session.organization.logoUrl} 
              alt="Logo da organização"
              className="h-full w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-logo.svg';
              }}
            />
          </div>
          <h5 className="text-lg font-bold text-blue-600 max-w-44">
            {session.organization.corporateName}
          </h5>
        </div>
        
        <div className="flex flex-col space-y-3 items-center sm:items-start">
          <div className="flex items-center space-x-3">
            <Phone className="h-6 w-6 text-blue-600" />
            <span className="text-lg text-blue-600">
              {phoneMask(session.organization.contactPhone)}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Mail className="h-6 w-6 text-blue-600" />
            <span className="text-lg text-blue-600">
              {session.organization.email}
            </span>
          </div>
          
          {session.organization.address && (
            <div className="flex items-center space-x-3">
              <Home className="h-6 w-6 text-blue-600" />
              <span className="text-lg text-blue-600 text-center sm:text-left">
                {session.organization.address.street}, {session.organization.address.number} - {' '}
                {session.organization.address.neighborhood} - {' '}
                {session.organization.address.city}/{session.organization.address.state}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationFooter;
