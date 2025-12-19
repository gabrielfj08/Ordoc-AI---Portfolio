'use client';

import * as React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import EditOrganization from './Edit';
import { EditOrganizationContainerProps, Organization, EditOrganizationFormValues } from './types';
import organizationsService from '@/services/organizations';

const EditOrganizationContainer = ({ organizationId }: EditOrganizationContainerProps) => {
  const { user } = useAuth();
  const [organization, setOrganization] = React.useState<Organization | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Debug logs
        console.log('🔍 DEBUG - Organization ID:', organizationId);
        console.log('🔍 DEBUG - User:', user);
        
        // Fetch organization from API
        const organizationData = await organizationsService.getOrganization(organizationId);
        console.log('🔍 DEBUG - Organization data received:', organizationData);
        setOrganization(organizationData);
      } catch (err: any) {
        console.error('🔍 DEBUG - Error details:', {
          status: err?.response?.status,
          statusText: err?.response?.statusText,
          data: err?.response?.data,
          message: err?.message,
          organizationId,
          fullError: err
        });
        
        // Check if it's a token expiration issue
        if (err?.response?.status === 401) {
          console.warn('🔒 Token expired - user needs to login again');
          setError('Sua sessão expirou. Por favor, faça login novamente.');
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else if (err?.response?.status === 404) {
          console.warn('🔍 Organization not found');
          setError('Organização não encontrada. Verifique se o ID está correto ou se você tem permissão para acessá-la.');
        } else {
          setError(err?.response?.data?.detail || err?.message || 'Erro ao carregar organização');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [organizationId]);

  const handleSubmit = async (values: EditOrganizationFormValues): Promise<Organization> => {
    try {
      console.log('Updating organization:', values);
      
      // Update organization via API
      const updatedOrganization = await organizationsService.updateOrganization(organizationId, values);
      
      setOrganization(updatedOrganization);
      return updatedOrganization;
    } catch (error: any) {
      console.error('Error updating organization:', error);
      const errorMessage = error?.response?.data?.detail || 
                          error?.response?.data?.message || 
                          error?.message || 
                          'Erro ao atualizar organização';
      throw new Error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded mt-2 w-1/2 animate-pulse"></div>
          </div>
          <div className="p-6 space-y-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erro ao carregar organização</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Organização não encontrada</h3>
              <p className="text-sm text-yellow-700 mt-1">A organização solicitada não foi encontrada.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <EditOrganization data={organization} onSubmit={handleSubmit} />;
};

export default EditOrganizationContainer;
