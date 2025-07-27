'use client';

import * as React from 'react';
import { NewUserModalContainerProps, NewUserFormValues, CreateUserResponse } from './types';
import NewUserModal from './NewUserModal';
import { useAuth } from '@/contexts/AuthContext';

const NewUserModalContainer = ({
  isOpen,
  onClose,
  onUserCreated,
}: NewUserModalContainerProps) => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string>('');

  const handleSubmit = async (values: NewUserFormValues): Promise<CreateUserResponse> => {
    if (!token) {
      const errorMsg = 'Você precisa estar logado para criar usuários. Faça login novamente.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setIsLoading(true);
    setError('');

    try {
      // Prepare data for API
      const userData = {
        username: values.username,
        email: values.email,
        first_name: values.firstName,
        last_name: values.lastName,
        phone: values.phone || null,
        cpf: values.cpf || null,
        date_of_birth: values.dateOfBirth || null,
        registration_number: values.registrationNumber || null,
        role: values.role,
        must_change_password: values.mustChangePassword,
        send_welcome_email: values.sendWelcomeEmail,
        status: 'active', // Default status for new users
      };

      // Debug logs
      console.log('🔍 DEBUG - Dados sendo enviados:', userData);
      console.log('🔍 DEBUG - Token:', token ? 'Token presente' : 'Token ausente');
      console.log('🔍 DEBUG - URL:', `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ordoc-cloud/users/`);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ordoc-cloud/users/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        }
      );

      console.log('🔍 DEBUG - Status da resposta:', response.status);
      console.log('🔍 DEBUG - Headers da resposta:', Object.fromEntries(response.headers.entries()));

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('🔍 DEBUG - Dados da resposta (JSON):', data);
      } else {
        // If not JSON, get text content (probably HTML error page)
        const textContent = await response.text();
        console.log('🔍 DEBUG - Resposta não-JSON:', textContent.substring(0, 200) + '...');
        
        // Create a generic error object
        data = {
          error: `Erro do servidor (${response.status}): ${response.statusText}`,
          detail: 'O servidor retornou uma resposta inválida. Verifique se o backend está funcionando corretamente.'
        };
      }

      if (response.ok) {
        // Transform API response to match our interface
        const createdUser: CreateUserResponse = {
          id: data.id,
          username: data.username,
          email: data.email,
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          status: data.status,
          mustChangePassword: data.must_change_password || false,
          createdAt: data.created_at,
        };

        // Call success callback
        if (onUserCreated) {
          onUserCreated({
            id: data.id,
            username: data.username,
            email: data.email,
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            type: 'internal',
            status: data.status,
            phone: data.phone,
            cpf: data.cpf,
            dateOfBirth: data.date_of_birth,
            registrationNumber: data.registration_number,
            avatar: data.avatar,
            mustChangePassword: data.must_change_password || false,
            createdAt: data.created_at,
          });
        }

        // Close modal on success
        onClose();

        return createdUser;
      } else {
        // Handle API errors
        const errorMessage = data.error || data.detail || 'Erro ao criar usuário';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado ao criar usuário';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <NewUserModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default NewUserModalContainer;
