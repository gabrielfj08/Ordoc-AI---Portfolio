'use client';

import React from 'react';
import { X, User, Mail, Phone, Calendar, CreditCard, Hash, UserCheck } from 'lucide-react';
import { ShowUserModalProps, UserStatus } from './types';
import SendPassword from './SendPassword';

const getStatusColor = (status: UserStatus) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'inactive':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'blocked':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusLabel = (status: UserStatus) => {
  switch (status) {
    case 'active':
      return 'Ativo';
    case 'inactive':
      return 'Inativo';
    case 'pending':
      return 'Pendente';
    case 'blocked':
      return 'Bloqueado';
    default:
      return 'Desconhecido';
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Não informado';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  } catch {
    return 'Data inválida';
  }
};

const formatCPF = (cpf?: string) => {
  if (!cpf) return 'Não informado';
  
  // Format CPF: 000.000.000-00
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return cpf;
};

const formatPhone = (phone?: string) => {
  if (!phone) return 'Não informado';
  
  // Format phone: (00) 00000-0000
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
};

const ShowUserModal: React.FC<ShowUserModalProps> = ({ user, onClose }) => {
  const handleSendPasswordSuccess = () => {
    // Optional: Show a toast notification or update UI
    console.log('Password sent successfully');
  };

  const handleSendPasswordError = (error: string) => {
    // Optional: Show error notification
    console.error('Error sending password:', error);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Visualizar Usuário</h2>
              <p className="text-sm text-gray-600">Detalhes e informações do usuário</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* User Avatar and Basic Info */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="relative">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                )}
                <div className={`absolute -bottom-1 -right-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                  {getStatusLabel(user.status)}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500">@{user.username}</p>
              </div>
            </div>

            {/* User Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
                  Informações Pessoais
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">CPF</p>
                      <p className="text-sm text-gray-600">{formatCPF(user.cpf)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Data de Nascimento</p>
                      <p className="text-sm text-gray-600">{formatDate(user.dateOfBirth)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Telefone</p>
                      <p className="text-sm text-gray-600">{formatPhone(user.phone)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
                  Informações do Sistema
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <UserCheck className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Username</p>
                      <p className="text-sm text-gray-600 font-mono">@{user.username}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Hash className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Nº de Matrícula</p>
                      <p className="text-sm text-gray-600">{user.registrationNumber || 'Não informado'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Criado em</p>
                      <p className="text-sm text-gray-600">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Última atualização</p>
                      <p className="text-sm text-gray-600">{formatDate(user.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User ID (for debugging/admin purposes) */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">
                <span className="font-medium">ID:</span> {user.id}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Envie uma nova senha para o usuário por email
            </div>
            <div className="flex-shrink-0 w-64">
              <SendPassword
                userId={user.id}
                onSuccess={handleSendPasswordSuccess}
                onError={handleSendPasswordError}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowUserModal;
