'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { ShowUserModalContainerProps, User } from './types';
import ShowUserModal from './ShowUserModal';
import ShowUserModalError from './Error';
import { useAuth } from '../../../../../contexts/AuthContext';

// Mock service for now - will be replaced with real API integration
const mockUserService = {
  getById: async (userId: string): Promise<User> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const mockUser: User = {
      id: userId,
      name: 'João Silva Santos',
      email: 'joao.silva@empresa.com.br',
      cpf: '12345678901',
      dateOfBirth: '1985-03-15',
      phone: '11987654321',
      registrationNumber: 'MAT2024001',
      username: 'joao.silva',
      status: 'active',
      organizationId: 'ddbec16e-72cb-42f7-949e-6a3d1d29b356',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-07-20T14:45:00Z',
      avatarUrl: undefined // Will use default avatar
    };
    
    return mockUser;
  }
};

const ShowUserModalContainer: React.FC<ShowUserModalContainerProps & { onClose: () => void }> = ({ 
  userId, 
  onClose 
}) => {
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const userData = await mockUserService.getById(userId);
        setUser(userData);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Erro ao carregar usuário';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (!currentUser) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-700">Verificando autenticação...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-700">Carregando usuário...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ShowUserModalError
        onClose={onClose}
        onRetry={() => window.location.reload()}
        error={error}
      />
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">Usuário Não Encontrado</h3>
          </div>
          <p className="text-gray-600 mb-4">
            O usuário solicitado não foi encontrado ou você não tem permissão para visualizá-lo.
          </p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return <ShowUserModal user={user} onClose={onClose} />;
};

export default ShowUserModalContainer;
