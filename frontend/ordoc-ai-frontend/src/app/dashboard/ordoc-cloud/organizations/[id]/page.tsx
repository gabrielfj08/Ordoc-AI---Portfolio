'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  BuildingOfficeIcon,
  ArrowLeftIcon,
  PencilIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ServerIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  MapPinIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingScreen from '@/components/ui/LoadingScreen';
import organizationsService from '@/services/organizations';
import { Organization } from '@/components/ordoc-cloud/organizations/edit/types';
import { useToast } from '@/components/ui/use-toast';
import StorageUsageChart from '@/components/charts/StorageUsageChart';
import UserActivityChart from '@/components/charts/UserActivityChart';
import DepartmentDocumentsChart from '@/components/charts/DepartmentDocumentsChart';
import { useRoleAccess, WithPermission } from '@/hooks/usePermissions';
import { Permission } from '@/utils/permissions';

// Interface for organization with extended details
interface OrganizationDetails extends Organization {
  total_users?: number;
  total_documents?: number;
  total_storage_used?: number;
  active_users?: number;
  departments_count?: number;
  created_at?: string;
  updated_at?: string;
}

// Interface for organization stats
interface OrganizationStats {
  users: number;
  documents: number;
  storage_used: string;
  active_users: number;
  departments: number;
  recent_activity: string;
}

// Mock users data for the organization
interface OrganizationUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  last_login?: string;
  avatar?: string;
}

export default function OrganizationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params?.id as string;
  const [organization, setOrganization] = useState<OrganizationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<OrganizationUser[]>([]);
  const [stats, setStats] = useState<OrganizationStats>({
    users: 0,
    documents: 0,
    storage_used: '0 GB',
    active_users: 0,
    departments: 0,
    recent_activity: 'Hoje'
  });
  const { toast } = useToast();
  
  // Get user permissions
  const {
    canEditOrganization,
    canDeleteOrganization,
    canViewAnalytics,
    canManageSettings,
    canViewUsers,
    showAnalyticsTab,
    showSettingsTab,
    showUsersSection
  } = useRoleAccess();

  // Fetch organization details
  const fetchOrganizationDetails = async () => {
    if (!organizationId) return;

    try {
      setLoading(true);
      setError(null);
      
      const orgData = await organizationsService.getOrganization(organizationId);
      setOrganization(orgData);

      // Mock additional data - in real implementation these would come from the API
      setStats({
        users: 15,
        documents: 247,
        storage_used: '2.4 GB',
        active_users: 8,
        departments: 4,
        recent_activity: 'Hoje'
      });

      // Mock users data
      setUsers([
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@empresa.com',
          role: 'Administrador',
          status: 'active',
          last_login: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria@empresa.com',
          role: 'Gerente',
          status: 'active',
          last_login: '2024-01-15T09:15:00Z'
        },
        {
          id: '3',
          name: 'Pedro Costa',
          email: 'pedro@empresa.com',
          role: 'Usuário',
          status: 'pending',
        }
      ]);

    } catch (err: any) {
      console.error('Error fetching organization details:', err);
      setError(err?.message || 'Erro ao carregar detalhes da organização');
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os detalhes da organização.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizationDetails();
  }, [organizationId]);

  const getUserStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      inactive: 'outline',
      pending: 'secondary'
    };

    const labels: Record<string, string> = {
      active: 'Ativo',
      inactive: 'Inativo',
      pending: 'Pendente'
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !organization) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <BuildingOfficeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {error ? 'Erro ao carregar organização' : 'Organização não encontrada'}
            </h2>
            <p className="text-gray-500 mb-4">
              {error || 'A organização solicitada não existe ou foi removida.'}
            </p>
            <Button onClick={() => router.push('/dashboard/ordoc-cloud/organizations')}>
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Voltar às Organizações
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push('/dashboard/ordoc-cloud/organizations')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                </Button>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <BuildingOfficeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{organization.corporateName}</h1>
                  <p className="text-sm text-gray-500">{organization.cnpj || 'CNPJ não informado'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="default">Ativa</Badge>
                <WithPermission permission={Permission.EDIT_ORGANIZATION}>
                  <Button 
                    onClick={() => router.push(`/dashboard/ordoc-cloud/organizations/${organizationId}/edit`)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                </WithPermission>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <UsersIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Usuários</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DocumentTextIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Documentos</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.documents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ServerIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Armazenamento</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.storage_used}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <UserGroupIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Usuários Ativos</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.active_users}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              {showAnalyticsTab() && (
                <TabsTrigger value="analytics">Analíticos</TabsTrigger>
              )}
              {showUsersSection() && (
                <TabsTrigger value="users">Usuários</TabsTrigger>
              )}
              {showSettingsTab() && (
                <TabsTrigger value="settings">Configurações</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Organization Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informações da Organização</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">E-mail</p>
                        <p className="text-gray-900">{organization.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Telefone</p>
                        <p className="text-gray-900">{organization.phone || 'Não informado'}</p>
                      </div>
                    </div>

                    {organization.site && (
                      <div className="flex items-center space-x-3">
                        <GlobeAltIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Site</p>
                          <a 
                            href={organization.site} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {organization.site}
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <MapPinIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Endereço</p>
                        <p className="text-gray-900">
                          {organization.address?.street || 'Endereço não informado'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informações de Contato</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nome do Contato</p>
                      <p className="text-gray-900">{organization.contactName}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Telefone do Contato</p>
                      <p className="text-gray-900">{organization.contactPhone}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Limite de Armazenamento</p>
                      <p className="text-gray-900">{organization.storageLimit} GB</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Aplicações Ativas</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {organization.apps?.map((app) => (
                          <Badge key={app.id} variant="outline">
                            {app.name}
                          </Badge>
                        )) || (
                          <Badge variant="outline">OrdocAir</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {showAnalyticsTab() && (
              <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Storage Usage Chart */}
                <Card>
                  <CardContent className="p-6">
                    <StorageUsageChart 
                      totalStorage={parseInt(organization.storageLimit)}
                      usedStorage={2.4}
                    />
                  </CardContent>
                </Card>

                {/* User Activity Chart */}
                <Card>
                  <CardContent className="p-6">
                    <UserActivityChart period="week" />
                  </CardContent>
                </Card>
              </div>

              {/* Department Documents Chart */}
              <Card>
                <CardContent className="p-6">
                  <DepartmentDocumentsChart />
                </CardContent>
              </Card>
              </TabsContent>
            )}

            {showUsersSection() && (
              <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usuários da Organização</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <p className="text-xs text-gray-400">{user.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {user.last_login && (
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Último login</p>
                              <p className="text-xs text-gray-400">
                                {new Date(user.last_login).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          )}
                          {getUserStatusBadge(user.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              </TabsContent>
            )}

            {showSettingsTab() && (
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações da Organização</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Administrativas</h3>
                        <div className="space-y-3">
                          <Button variant="outline" className="w-full justify-start">
                            <PencilIcon className="w-4 h-4 mr-2" />
                            Editar Organização
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <UserGroupIcon className="w-4 h-4 mr-2" />
                            Gerenciar Usuários
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <ServerIcon className="w-4 h-4 mr-2" />
                            Configurar Armazenamento
                          </Button>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-red-600 mb-4">Zona de Perigo</h3>
                        <div className="space-y-3">
                          <WithPermission permission={Permission.ACTIVATE_ORGANIZATION}>
                            <Button variant="destructive" className="w-full justify-start">
                              Desativar Organização
                            </Button>
                          </WithPermission>
                          <WithPermission permission={Permission.DELETE_ORGANIZATION}>
                            <Button variant="destructive" className="w-full justify-start">
                              Excluir Organização
                            </Button>
                          </WithPermission>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
