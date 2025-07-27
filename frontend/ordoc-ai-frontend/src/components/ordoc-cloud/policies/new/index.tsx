'use client';

import * as React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NewPolicyContainerProps, NewPolicyFormValues, Policy } from './types';
import NewPolicy from './NewPolicy';

// Mock service for now - will be replaced with real API integration
const mockPolicyService = {
  create: async (formData: NewPolicyFormValues): Promise<Policy> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful response
    const mockPolicy: Policy = {
      id: `policy-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      service: formData.service,
      effect: formData.effect,
      actionIds: formData.actionIds,
      resource: formData.resource,
      organizationId: 'mock-org-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return mockPolicy;
  }
};

const NewPolicyContainer = ({}: NewPolicyContainerProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (values: NewPolicyFormValues): Promise<Policy> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add organization ID from user context
      const formDataWithOrg = {
        ...values,
        organizationId: user?.organization?.id || '',
      };
      
      // Call the mock service (will be replaced with real API)
      const result = await mockPolicyService.create(formDataWithOrg);
      
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao criar política';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}
      
      <NewPolicy onSubmit={handleSubmit} />
      
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-gray-700">Criando política...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPolicyContainer;
