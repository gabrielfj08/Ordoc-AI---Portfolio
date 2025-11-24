'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
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
import organizationsService, { OrganizationListResponse } from '@/services/organizations';
import { Organization } from '@/components/ordoc-cloud/organizations/edit/types';
import { useToast } from '@/components/ui/use-toast';
import CreateOrganizationModal from '@/components/ordoc-cloud/organizations/create/CreateOrganizationModal';
import EditOrganization from '@/components/ordoc-cloud/organizations/edit/Edit';
import { useRoleAccess, WithPermission } from '@/hooks/usePermissions';
import { Permission } from '@/utils/permissions';

// Interface for backend Organization data
interface BackendOrganization {
  id: string;
  corporate_name: string;
  cnpj: string;
  email: string;
  phone?: string;
  contact_name: string;
  contact_phone: string;
  site?: string;
  is_active: boolean;
  created_at: string;
  total_users?: number;
  total_documents?: number;
  total_storage_used?: number;
}

interface FilterParams {
  search: string;
  status: string;
  page: number;
  ordering: string;
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<BackendOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewOrgModal, setShowNewOrgModal] = useState(false);
  const [showEditOrgModal, setShowEditOrgModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<BackendOrganization | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Get user permissions
  const {
    canEditOrganization,
    canDeleteOrganization,
    canActivateOrganization,
    showCreateButton,
    showEditButton,
    showDeleteButton
  } = useRoleAccess();
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
    current_page: 1,
    total_pages: 1
  });
  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    status: '',
    page: 1,
    ordering: 'corporate_name'
  });
  const { toast } = useToast();

  // Fetch organizations from backend
  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page: filters.page,
        page_size: 10,
        ordering: filters.ordering
      };
      
      if (filters.search.trim()) {
        params.search = filters.search;
      }
      
      // Note: Backend uses is_active boolean, so we convert status filter
      if (filters.status === 'active') {
        params.is_active = true;
      } else if (filters.status === 'inactive') {
        params.is_active = false;
      }
      
      const response: OrganizationListResponse = await organizationsService.getOrganizations(params);
      
      // Transform backend response to component format
      const transformedOrganizations: BackendOrganization[] = response.results.map(org => ({
        id: org.id,
        corporate_name: org.corporateName,
        cnpj: org.cnpj || '',
        email: org.email,
        phone: org.phone,
        contact_name: org.contactName,
        contact_phone: org.contactPhone,
        site: org.site,
        is_active: true, // Assuming active for now since status logic varies
        created_at: new Date().toISOString(), // Default to current time if not provided
        total_users: 0, // Will be calculated by backend
        total_documents: 0,
        total_storage_used: 0
      }));
      
      setOrganizations(transformedOrganizations);
      setPagination({
        count: response.count,
        next: response.next,
        previous: response.previous,
        current_page: filters.page,
        total_pages: Math.ceil(response.count / 10)
      });
    } catch (err: any) {
      console.error('Error fetching organizations:', err);
      setError(err?.message || 'Erro ao carregar organizações');
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as organizações.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [filters]);

  const getStatusBadge = (isActive: boolean) => {
    const status = isActive ? 'active' : 'inactive';
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      inactive: 'outline'
    };

    const labels: Record<string, string> = {
      active: 'Ativa',
      inactive: 'Inativa'
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] || status}
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

  const handleActionClick = async (action: string, organization: BackendOrganization) => {
    setSelectedOrganization(organization);
    
    switch (action) {
      case 'view':
        window.location.href = `/dashboard/ordoc-cloud/organizations/${organization.id}`;
        break;
      case 'edit':
        setShowEditOrgModal(true);
        break;
      case 'delete':
        setShowDeleteDialog(true);
        break;
      case 'activate':
        await handleToggleStatus(organization.id, true);
        break;
      case 'deactivate':
        await handleToggleStatus(organization.id, false);
        break;
    }
  };

  const handleToggleStatus = async (organizationId: string, isActive: boolean) => {
    try {
      // The backend has activate/deactivate endpoints
      if (isActive) {
        await organizationsService.activateOrganization(organizationId);
      } else {
        await organizationsService.deactivateOrganization(organizationId);
      }
      
      toast({
        title: 'Sucesso',
        description: `Organização ${isActive ? 'ativada' : 'desativada'} com sucesso.`,
        variant: 'success'
      });
      
      // Refresh the list
      fetchOrganizations();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error?.message || `Erro ao ${isActive ? 'ativar' : 'desativar'} organização.`,
        variant: 'destructive'
      });
    }
  };

  const handleDeleteOrganization = async () => {
    if (!selectedOrganization) return;
    
    setDeleting(true);
    try {
      await organizationsService.deleteOrganization(selectedOrganization.id);
      
      toast({
        title: 'Sucesso',
        description: 'Organização excluída com sucesso.',
        variant: 'success'
      });
      
      setShowDeleteDialog(false);
      setSelectedOrganization(null);
      fetchOrganizations();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error?.message || 'Erro ao excluir organização.',
        variant: 'destructive'
      });
    } finally {
      setDeleting(false);
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
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <BuildingOfficeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Organizações</h1>
                  <p className="text-sm text-gray-500">Gerencie organizações e filiais do sistema</p>
                </div>
              </div>
              <WithPermission permission={Permission.CREATE_ORGANIZATION}>
                <Button onClick={() => setShowNewOrgModal(true)} className="bg-blue-600 hover:bg-blue-700">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Nova Organização
                </Button>
              </WithPermission>
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
                      placeholder="Buscar por nome, CNPJ ou email..."
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
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="inactive">Inativa</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.ordering} onValueChange={(value) => handleFilterChange('ordering', value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporate_name">Nome A-Z</SelectItem>
                    <SelectItem value="-corporate_name">Nome Z-A</SelectItem>
                    <SelectItem value="-created_at">Mais recentes</SelectItem>
                    <SelectItem value="created_at">Mais antigas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Organizations Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Organizações ({pagination.count})
                </CardTitle>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Página {pagination.current_page} de {pagination.total_pages}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organização</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Usuários</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criada em</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizations.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{org.corporate_name}</div>
                              <div className="text-sm text-gray-500">{org.cnpj}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="text-gray-900">{org.email}</div>
                            {org.phone && (
                              <div className="text-gray-500">{org.phone}</div>
                            )}
                            {org.contact_name && (
                              <div className="text-gray-500 text-xs">Contato: {org.contact_name}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-400">Não informado</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">{org.total_users || 0}</span>
                            <span className="text-gray-500"> usuários</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(org.is_active)}</TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">
                            {new Date(org.created_at).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(org.created_at).toLocaleTimeString('pt-BR')}
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
                              <WithPermission permission={Permission.VIEW_ORGANIZATION}>
                                <DropdownMenuItem onClick={() => handleActionClick('view', org)}>
                                  <EyeIcon className="w-4 h-4 mr-2" />
                                  Visualizar
                                </DropdownMenuItem>
                              </WithPermission>
                              
                              <WithPermission permission={Permission.EDIT_ORGANIZATION}>
                                <DropdownMenuItem onClick={() => handleActionClick('edit', org)}>
                                  <PencilIcon className="w-4 h-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                              </WithPermission>
                              
                              <WithPermission permission={Permission.ACTIVATE_ORGANIZATION}>
                                {org.is_active ? (
                                  <DropdownMenuItem onClick={() => handleActionClick('deactivate', org)}>
                                    Desativar
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleActionClick('activate', org)}>
                                    Ativar
                                  </DropdownMenuItem>
                                )}
                              </WithPermission>
                              
                              <WithPermission permission={Permission.DELETE_ORGANIZATION}>
                                <DropdownMenuItem 
                                  onClick={() => handleActionClick('delete', org)}
                                  className="text-red-600"
                                >
                                  <TrashIcon className="w-4 h-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </WithPermission>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {organizations.length === 0 && !loading && (
                <div className="text-center py-12">
                  <BuildingOfficeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {error ? 'Erro ao carregar organizações' : 'Nenhuma organização encontrada'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {error ? 'Tente recarregar a página.' :
                      (filters.search || filters.status
                        ? 'Tente ajustar os filtros de busca.' 
                        : 'Comece criando sua primeira organização.')}
                  </p>
                  {!error && (
                    <WithPermission permission={Permission.CREATE_ORGANIZATION}>
                      <Button onClick={() => setShowNewOrgModal(true)} className="bg-blue-600 hover:bg-blue-700">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Nova Organização
                      </Button>
                    </WithPermission>
                  )}
                </div>
              )}
              
              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Mostrando {((pagination.current_page - 1) * 10) + 1} a {Math.min(pagination.current_page * 10, pagination.count)} de {pagination.count} resultados
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={!pagination.previous}
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                    >
                      Anterior
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={!pagination.next}
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Create Organization Modal */}
        <CreateOrganizationModal 
          open={showNewOrgModal}
          onClose={() => setShowNewOrgModal(false)}
          onSuccess={() => {
            toast({
              title: 'Sucesso',
              description: 'Organização criada com sucesso!',
              variant: 'success'
            });
            fetchOrganizations();
          }}
        />

        {/* Edit Organization Modal */}
        {showEditOrgModal && selectedOrganization && (
          <Dialog open={showEditOrgModal} onOpenChange={setShowEditOrgModal}>
            <DialogContent className="max-w-4xl">
              <EditOrganization
                data={{
                  id: selectedOrganization.id,
                  corporateName: selectedOrganization.corporate_name,
                  cnpj: selectedOrganization.cnpj,
                  email: selectedOrganization.email,
                  phone: selectedOrganization.phone || '',
                  contactName: selectedOrganization.contact_name,
                  contactPhone: selectedOrganization.contact_phone,
                  site: selectedOrganization.site || '',
                  logoUrl: '',
                  storageLimit: '100',
                  appIds: [],
                  address: {
                    street: '',
                    number: '',
                    complement: '',
                    postalCode: '',
                    city: '',
                    state: '',
                    neighborhood: ''
                  },
                  apps: []
                }}
                onSubmit={async (values) => {
                  try {
                    const updated = await organizationsService.updateOrganization(selectedOrganization.id, values);
                    toast({
                      title: 'Sucesso',
                      description: 'Organização atualizada com sucesso!',
                      variant: 'success'
                    });
                    setShowEditOrgModal(false);
                    setSelectedOrganization(null);
                    fetchOrganizations();
                    return updated;
                  } catch (error: any) {
                    toast({
                      title: 'Erro',
                      description: error?.message || 'Erro ao atualizar organização.',
                      variant: 'destructive'
                    });
                    throw error;
                  }
                }}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir Organização</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir a organização "{selectedOrganization?.corporate_name}"? 
                Esta ação não pode ser desfeita e afetará todos os usuários associados.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteOrganization}
                disabled={deleting}
              >
                {deleting ? 'Excluindo...' : 'Excluir'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}