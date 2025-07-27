'use client';

import * as React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import organizationsService from '@/services/organizations';
import { ShowOrganizationContainerProps } from './types';
import ShowOrganization from './Show';

const ShowOrganizationContainer = ({
  organizationId,
}: ShowOrganizationContainerProps) => {
  const { user } = useAuth();
  const [organization, setOrganization] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await organizationsService.getOrganization(organizationId);
        setOrganization(data);
      } catch (err: any) {
        console.error('Error fetching organization:', err);
        setError(err.message || 'Erro ao carregar organização');
      } finally {
        setIsLoading(false);
      }
    };

    if (organizationId) {
      fetchOrganization();
    }
  }, [organizationId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando organização...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-medium">Erro ao carregar organização</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Organização não encontrada</p>
        </div>
      </div>
    );
  }

  return <ShowOrganization organization={organization} />;
};

export default ShowOrganizationContainer;
