'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  PlusIcon,
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

export default function UsersManagementPage() {
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
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {user.first_name?.charAt(0) || user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.first_name && user.last_name ? 
                                  `${user.first_name} ${user.last_name}` : 
                                  user.username
                                }
                              </div>
                              <div className="text-sm text-gray-500">@{user.username}</div>
                              {user.must_change_password && (
                                <div className="flex items-center text-xs text-orange-600">
                                  <LockClosedIcon className="w-3 h-3 mr-1" />
                                  Deve trocar senha
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {user.email}
                            {user.phone && (
                              <div className="text-gray-500">{user.phone}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {user.roles.map((role, index) => (
                              <div key={index}>
                                {getRoleBadge(role.role)}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">
                            {new Date(user.created_at).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(user.created_at).toLocaleTimeString('pt-BR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <EllipsisVerticalIcon className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleActionClick('edit', user)}>
                                <PencilIcon className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              {user.status === 'active' ? (
                                <DropdownMenuItem onClick={() => handleActionClick('deactivate', user)}>
                                  <LockClosedIcon className="w-4 h-4 mr-2" />
                                  Desativar
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleActionClick('activate', user)}>
                                  <LockOpenIcon className="w-4 h-4 mr-2" />
                                  Ativar
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleActionClick('force_password_change', user)}>
                                <LockClosedIcon className="w-4 h-4 mr-2" />
                                Forçar troca de senha
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleActionClick('delete', user)}
                                className="text-red-600"
                              >
                                <TrashIcon className="w-4 h-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir Usuário</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir o usuário "{selectedUser?.username}"? 
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  console.log('Deleting user:', selectedUser?.id);
                  setShowDeleteDialog(false);
                  setSelectedUser(null);
                }}
              >
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}