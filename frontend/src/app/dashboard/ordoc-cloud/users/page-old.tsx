'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  UsersIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  LockClosedIcon,
  LockOpenIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingScreen from '@/components/ui/LoadingScreen';

// Types
interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  status: 'active' | 'inactive' | 'blocked' | 'pending';
  phone?: string;
  cpf?: string;
  created_at: string;
  must_change_password: boolean;
  roles: Array<{
    role: string;
    organization: string;
  }>;
}

interface FilterParams {
  search: string;
  status: string;
  role: string;
  page: number;
  ordering: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    status: '',
    role: '',
    page: 1,
    ordering: '-created_at'
  });

  // Mock data for development
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        first_name: 'Administrador',
        last_name: 'Sistema',
        status: 'active',
        phone: '(11) 99999-9999',
        cpf: '123.456.789-00',
        created_at: '2024-01-15T10:00:00Z',
        must_change_password: false,
        roles: [{ role: 'admin', organization: 'Organização Demo' }]
      },
      {
        id: '2',
        username: 'manager',
        email: 'manager@example.com',
        first_name: 'Gerente',
        last_name: 'Operacional',
        status: 'active',
        phone: '(11) 88888-8888',
        cpf: '987.654.321-00',
        created_at: '2024-01-20T14:30:00Z',
        must_change_password: true,
        roles: [{ role: 'organization_manager', organization: 'Organização Demo' }]
      },
      {
        id: '3',
        username: 'user1',
        email: 'user1@example.com',
        first_name: 'Usuário',
        last_name: 'Comum',
        status: 'pending',
        created_at: '2024-02-01T09:15:00Z',
        must_change_password: true,
        roles: [{ role: 'organization_member', organization: 'Organização Demo' }]
      }
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, [filters]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      pending: 'secondary',
      inactive: 'outline',
      blocked: 'destructive'
    };

    const labels: Record<string, string> = {
      active: 'Ativo',
      pending: 'Pendente',
      inactive: 'Inativo',
      blocked: 'Bloqueado'
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      organization_manager: 'Gerente',
      organization_member: 'Membro',
      department_manager: 'Gerente Depto',
      department_member: 'Membro Depto'
    };

    return (
      <Badge variant="outline">
        {labels[role] || role}
      </Badge>
    );
  };

  const handleFilterChange = (key: keyof FilterParams, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset page when other filters change
    }));
  };

  const handleActionClick = (action: string, user: User) => {
    setSelectedUser(user);
    
    switch (action) {
      case 'edit':
        setShowEditUserModal(true);
        break;
      case 'delete':
        setShowDeleteDialog(true);
        break;
      case 'activate':
        // Handle activation
        console.log('Activating user:', user.id);
        break;
      case 'deactivate':
        // Handle deactivation
        console.log('Deactivating user:', user.id);
        break;
      case 'force_password_change':
        // Handle forcing password change
        console.log('Forcing password change for user:', user.id);
        break;
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard/ordoc-cloud" className="text-gray-500 hover:text-gray-700">
                  <ArrowLeftIcon className="w-6 h-6" />
                </Link>
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gestão de Usuários</h1>
                  <p className="text-sm text-gray-500">Criar, editar e gerenciar usuários do sistema</p>
                </div>
              </div>
              <Button onClick={() => setShowNewUserModal(true)} className="bg-green-600 hover:bg-green-700">
                <PlusIcon className="w-4 h-4 mr-2" />
                Novo Usuário
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Buscar por nome, email ou usuário..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os Status</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="blocked">Bloqueado</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.role} onValueChange={(value) => handleFilterChange('role', value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as Funções</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="organization_manager">Gerente</SelectItem>
                    <SelectItem value="organization_member">Membro</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.ordering} onValueChange={(value) => handleFilterChange('ordering', value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-created_at">Mais recentes</SelectItem>
                    <SelectItem value="created_at">Mais antigos</SelectItem>
                    <SelectItem value="first_name">Nome A-Z</SelectItem>
                    <SelectItem value="-first_name">Nome Z-A</SelectItem>
                    <SelectItem value="email">Email A-Z</SelectItem>
                    <SelectItem value="-email">Email Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Usuários ({users.length})
                </CardTitle>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Página 1 de 1</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr 
                        key={user.id} 
                        className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getRoleBadge(user.role)}>
                            {user.role || 'Usuário'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(user.status)}>
                            {getStatusText(user.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUser(user);
                                setShowUserModal(true);
                              }}
                              className="text-green-600 hover:text-green-900"
                            >
                              Visualizar
                            </button>
                            <Link
                              href={`/dashboard/ordoc-cloud/users/${user.id}/edit`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Editar
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {users.length === 0 && (
            <div className="text-center py-12">
              <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário encontrado</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || statusFilter || roleFilter
                  ? 'Tente ajustar os filtros de busca.' 
                  : 'Comece criando seu primeiro usuário.'}
              </p>
              <button 
                onClick={() => setShowNewUserModal(true)}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Novo Usuário
              </button>
            </div>
          )}
          </div>

          {/* Pagination */}
          {users.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow-sm">
              <div className="flex-1 flex justify-between sm:hidden">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Anterior
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Próximo
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">1</span> a <span className="font-medium">{users.length}</span> de{' '}
                    <span className="font-medium">{users.length}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      Anterior
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-green-50 text-sm font-medium text-green-600">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      Próximo
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

      {/* Modals */}
      {showNewUserModal && (
        <NewUserModal
          isOpen={showNewUserModal}
          onClose={() => setShowNewUserModal(false)}
        />
      )}

      {showUserModal && selectedUser?.id && (
        <ShowUserModal
          userId={selectedUser.id}
          onClose={() => setShowUserModal(false)}
        />
      )}
    </ProtectedRoute>
  );
}
