'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon
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
import { TableSkeleton } from '@/components/ui/skeletons';

// Types
interface Policy {
  id: string;
  name: string;
  description: string;
  effect: 'allow' | 'deny';
  service: string;
  resource: string[];
  source: 'system_managed' | 'customer_managed';
  is_public: boolean;
  created_at: string;
  user_groups_count?: number;
  users_count?: number;
}

interface FilterParams {
  search: string;
  effect: string;
  service: string;
  source: string;
  page: number;
  ordering: string;
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPolicyModal, setShowNewPolicyModal] = useState(false);
  const [showEditPolicyModal, setShowEditPolicyModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    effect: '',
    service: '',
    source: '',
    page: 1,
    ordering: 'name'
  });

  // Mock data for development
  useEffect(() => {
    const mockPolicies: Policy[] = [
      {
        id: '1',
        name: 'Admin Full Access',
        description: 'Política que concede acesso total aos administradores do sistema',
        effect: 'allow',
        service: 'ordoc_cloud',
        resource: ['*'],
        source: 'system_managed',
        is_public: false,
        created_at: '2024-01-15T10:00:00Z',
        user_groups_count: 1,
        users_count: 2
      },
      {
        id: '2',
        name: 'User Document Read',
        description: 'Permite visualizar e baixar documentos para usuários padrão',
        effect: 'allow',
        service: 'ordoc_air',
        resource: ['document:read', 'document:list'],
        source: 'customer_managed',
        is_public: true,
        created_at: '2024-01-20T14:30:00Z',
        user_groups_count: 3,
        users_count: 15
      },
      {
        id: '3',
        name: 'Deny Sensitive Operations',
        description: 'Política que bloqueia operações sensíveis do sistema',
        effect: 'deny',
        service: 'ordoc_flow',
        resource: ['procedure:delete', 'template:delete'],
        source: 'system_managed',
        is_public: false,
        created_at: '2024-02-01T09:15:00Z',
        user_groups_count: 0,
        users_count: 0
      }
    ];

    setTimeout(() => {
      setPolicies(mockPolicies);
      setLoading(false);
    }, 1000);
  }, [filters]);

  const getEffectBadge = (effect: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      allow: 'default',
      deny: 'destructive'
    };

    const labels: Record<string, string> = {
      allow: 'Permitir',
      deny: 'Negar'
    };

    const icons = {
      allow: CheckIcon,
      deny: XMarkIcon
    };

    const Icon = icons[effect as keyof typeof icons];

    return (
      <Badge variant={variants[effect] || 'outline'} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {labels[effect] || effect}
      </Badge>
    );
  };

  const getSourceBadge = (source: string) => {
    const labels: Record<string, string> = {
      system_managed: 'Sistema',
      customer_managed: 'Cliente'
    };

    return (
      <Badge variant="outline">
        {labels[source] || source}
      </Badge>
    );
  };

  const getServiceBadge = (service: string) => {
    const labels: Record<string, string> = {
      ordoc_air: 'OrdocAir',
      ordoc_flow: 'OrdocFlow',
      ordoc_cloud: 'OrdocCloud',
      ordoc_sign: 'OrdocSign',
      ordoc_reports: 'OrdocReports'
    };

    const colors: Record<string, string> = {
      ordoc_air: 'bg-blue-100 text-blue-800',
      ordoc_flow: 'bg-green-100 text-green-800',
      ordoc_cloud: 'bg-purple-100 text-purple-800',
      ordoc_sign: 'bg-orange-100 text-orange-800',
      ordoc_reports: 'bg-pink-100 text-pink-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[service] || 'bg-gray-100 text-gray-800'}`}>
        {labels[service] || service}
      </span>
    );
  };

  const handleFilterChange = (key: keyof FilterParams, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset page when other filters change
    }));
  };

  const handleActionClick = (action: string, policy: Policy) => {
    setSelectedPolicy(policy);
    
    switch (action) {
      case 'view':
        window.location.href = `/dashboard/ordoc-cloud/policies/${policy.id}`;
        break;
      case 'edit':
        setShowEditPolicyModal(true);
        break;
      case 'delete':
        setShowDeleteDialog(true);
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <TableSkeleton rows={10} columns={8} />
        </div>
      </div>
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
                <Link href="/dashboard/ordoc-cloud" className="text-gray-500 hover:text-gray-700">
                  <ArrowLeftIcon className="w-6 h-6" />
                </Link>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                  <ShieldCheckIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Políticas de Acesso</h1>
                  <p className="text-sm text-gray-500">Definir permissões e controle de acesso do sistema</p>
                </div>
              </div>
              <Button onClick={() => setShowNewPolicyModal(true)} className="bg-purple-600 hover:bg-purple-700">
                <PlusIcon className="w-4 h-4 mr-2" />
                Nova Política
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
                      placeholder="Buscar por nome, descrição ou recurso..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={filters.effect} onValueChange={(value) => handleFilterChange('effect', value)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Efeito" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="allow">Permitir</SelectItem>
                    <SelectItem value="deny">Negar</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.service} onValueChange={(value) => handleFilterChange('service', value)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="ordoc_air">OrdocAir</SelectItem>
                    <SelectItem value="ordoc_flow">OrdocFlow</SelectItem>
                    <SelectItem value="ordoc_cloud">OrdocCloud</SelectItem>
                    <SelectItem value="ordoc_sign">OrdocSign</SelectItem>
                    <SelectItem value="ordoc_reports">OrdocReports</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.source} onValueChange={(value) => handleFilterChange('source', value)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Origem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    <SelectItem value="system_managed">Sistema</SelectItem>
                    <SelectItem value="customer_managed">Cliente</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.ordering} onValueChange={(value) => handleFilterChange('ordering', value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nome A-Z</SelectItem>
                    <SelectItem value="-name">Nome Z-A</SelectItem>
                    <SelectItem value="-created_at">Mais recentes</SelectItem>
                    <SelectItem value="created_at">Mais antigas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Policies Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Políticas ({policies.length})
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
                      <TableHead>Política</TableHead>
                      <TableHead>Serviço</TableHead>
                      <TableHead>Efeito</TableHead>
                      <TableHead>Recursos</TableHead>
                      <TableHead>Origem</TableHead>
                      <TableHead>Atribuições</TableHead>
                      <TableHead>Criada em</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {policies.map((policy) => (
                      <TableRow key={policy.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <ShieldCheckIcon className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{policy.name}</div>
                              <div className="text-sm text-gray-500 max-w-xs truncate" title={policy.description}>
                                {policy.description}
                              </div>
                              {policy.is_public && (
                                <div className="inline-flex items-center mt-1">
                                  <Badge variant="secondary" className="text-xs">Pública</Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getServiceBadge(policy.service)}
                        </TableCell>
                        <TableCell>
                          {getEffectBadge(policy.effect)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {policy.resource.length > 2 ? (
                              <div className="space-y-1">
                                <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                  {policy.resource[0]}
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  +{policy.resource.length - 1} mais
                                </Badge>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                {policy.resource.map((resource, index) => (
                                  <div key={index} className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                    {resource}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getSourceBadge(policy.source)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="text-gray-900">
                              {(policy.user_groups_count || 0)} grupos
                            </div>
                            <div className="text-gray-500">
                              {(policy.users_count || 0)} usuários
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">
                            {new Date(policy.created_at).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(policy.created_at).toLocaleTimeString('pt-BR')}
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
                              <DropdownMenuItem onClick={() => handleActionClick('view', policy)}>
                                <EyeIcon className="w-4 h-4 mr-2" />
                                Visualizar
                              </DropdownMenuItem>
                              {policy.source === 'customer_managed' && (
                                <DropdownMenuItem onClick={() => handleActionClick('edit', policy)}>
                                  <PencilIcon className="w-4 h-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                              )}
                              {policy.source === 'customer_managed' && (
                                <DropdownMenuItem 
                                  onClick={() => handleActionClick('delete', policy)}
                                  className="text-red-600"
                                >
                                  <TrashIcon className="w-4 h-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {policies.length === 0 && (
                <div className="text-center py-12">
                  <ShieldCheckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma política encontrada</h3>
                  <p className="text-gray-500 mb-4">
                    {filters.search || filters.effect || filters.service
                      ? 'Tente ajustar os filtros de busca.' 
                      : 'Comece criando sua primeira política de acesso.'}
                  </p>
                  <Button onClick={() => setShowNewPolicyModal(true)} className="bg-purple-600 hover:bg-purple-700">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Nova Política
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir Política</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir a política "{selectedPolicy?.name}"? 
                Esta ação não pode ser desfeita e pode afetar o acesso de usuários.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  console.log('Deleting policy:', selectedPolicy?.id);
                  setShowDeleteDialog(false);
                  setSelectedPolicy(null);
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