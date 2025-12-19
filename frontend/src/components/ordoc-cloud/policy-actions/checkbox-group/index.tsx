/**
 * PolicyActions CheckboxGroup Container Component
 * Migrated from PrinterCloud PolicyActions/CheckboxGroup/index.tsx (Arquivo 19/51)
 * 
 * Enhanced version with modern React 19, mock data, and improved error handling
 * Original used React Query + real API, this version uses mock data for development
 */

'use client';

import * as React from 'react';
import { PolicyActionsCheckboxGroupContainerProps, PolicyAction, PolicyService } from './types';
import PolicyActionsCheckboxGroup from './PolicyActionsCheckboxGroup';
import PolicyActionsCheckboxGroupSkeleton from './Skeleton';
import PolicyActionsCheckboxGroupError from './Error';

// Mock data for different services - will be replaced with real API integration
const mockPolicyActions: Record<PolicyService, PolicyAction[]> = {
  ordoc_air: [
    {
      id: 'air_read',
      name: 'Visualizar',
      description: 'Visualizar documentos e pastas',
      service: 'ordoc_air',
      accessLevel: 1,
      category: 'Leitura',
    },
    {
      id: 'air_write',
      name: 'Editar',
      description: 'Criar e editar documentos',
      service: 'ordoc_air',
      accessLevel: 2,
      category: 'Escrita',
    },
    {
      id: 'air_delete',
      name: 'Excluir',
      description: 'Excluir documentos e pastas',
      service: 'ordoc_air',
      accessLevel: 4,
      category: 'Escrita',
    },
    {
      id: 'air_share',
      name: 'Compartilhar',
      description: 'Compartilhar documentos com outros usuários',
      service: 'ordoc_air',
      accessLevel: 3,
      category: 'Colaboração',
    },
    {
      id: 'air_admin',
      name: 'Administrar',
      description: 'Gerenciar configurações do OrdocAir',
      service: 'ordoc_air',
      accessLevel: 5,
      category: 'Administração',
    },
  ],
  ordoc_flow: [
    {
      id: 'flow_read',
      name: 'Visualizar',
      description: 'Visualizar processos e workflows',
      service: 'ordoc_flow',
      accessLevel: 1,
      category: 'Leitura',
    },
    {
      id: 'flow_write',
      name: 'Editar',
      description: 'Criar e editar processos',
      service: 'ordoc_flow',
      accessLevel: 2,
      category: 'Escrita',
    },
    {
      id: 'flow_approve',
      name: 'Aprovar',
      description: 'Aprovar solicitações e processos',
      service: 'ordoc_flow',
      accessLevel: 3,
      category: 'Aprovação',
    },
    {
      id: 'flow_manage',
      name: 'Gerenciar',
      description: 'Gerenciar workflows e configurações',
      service: 'ordoc_flow',
      accessLevel: 4,
      category: 'Administração',
    },
  ],
  ordoc_sign: [
    {
      id: 'sign_read',
      name: 'Visualizar',
      description: 'Visualizar documentos para assinatura',
      service: 'ordoc_sign',
      accessLevel: 1,
      category: 'Leitura',
    },
    {
      id: 'sign_sign',
      name: 'Assinar',
      description: 'Assinar documentos digitalmente',
      service: 'ordoc_sign',
      accessLevel: 2,
      category: 'Assinatura',
    },
    {
      id: 'sign_manage',
      name: 'Gerenciar',
      description: 'Gerenciar certificados e assinaturas',
      service: 'ordoc_sign',
      accessLevel: 4,
      category: 'Administração',
    },
  ],
  ordoc_reports: [
    {
      id: 'reports_read',
      name: 'Visualizar',
      description: 'Visualizar relatórios',
      service: 'ordoc_reports',
      accessLevel: 1,
      category: 'Leitura',
    },
    {
      id: 'reports_create',
      name: 'Criar',
      description: 'Criar novos relatórios',
      service: 'ordoc_reports',
      accessLevel: 2,
      category: 'Escrita',
    },
    {
      id: 'reports_export',
      name: 'Exportar',
      description: 'Exportar relatórios',
      service: 'ordoc_reports',
      accessLevel: 2,
      category: 'Escrita',
    },
  ],
  ordoc_cloud: [
    {
      id: 'cloud_read',
      name: 'Visualizar',
      description: 'Visualizar configurações',
      service: 'ordoc_cloud',
      accessLevel: 1,
      category: 'Leitura',
    },
    {
      id: 'cloud_write',
      name: 'Editar',
      description: 'Editar configurações',
      service: 'ordoc_cloud',
      accessLevel: 3,
      category: 'Configuração',
    },
    {
      id: 'cloud_manage_users',
      name: 'Gerenciar Usuários',
      description: 'Gerenciar usuários e permissões',
      service: 'ordoc_cloud',
      accessLevel: 4,
      category: 'Administração',
    },
    {
      id: 'cloud_manage_org',
      name: 'Gerenciar Organização',
      description: 'Gerenciar configurações da organização',
      service: 'ordoc_cloud',
      accessLevel: 5,
      category: 'Administração',
    },
  ],
};

const PolicyActionsCheckboxGroupContainer = ({
  service,
  disabled = false,
  selectedActions = [],
  onChange,
  error,
}: PolicyActionsCheckboxGroupContainerProps) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [data, setData] = React.useState<PolicyAction[]>([]);

  // Original PrinterCloud used React Query + real API:
  // const { isLoading, isError, data } = useQuery({
  //   queryKey: ['policyActions', { service, token }],
  //   queryFn: () => PolicyActionService.index(token, getSubdomain(), {
  //     'service[]': service, order: 'access_level', direction: 'asc', perPage: 1000
  //   })
  // });
  
  // Enhanced version with mock data and better state management
  React.useEffect(() => {
    const fetchPolicyActions = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        
        // Simulate network delay (original had real API calls)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get mock data for the service (original used PolicyActionService.index)
        const actions = mockPolicyActions[service] || [];
        
        // Sort by access level and name (matching original behavior)
        const sortedActions = actions.sort((a, b) => {
          if (a.accessLevel !== b.accessLevel) {
            return a.accessLevel - b.accessLevel;
          }
          return a.name.localeCompare(b.name);
        });
        
        setData(sortedActions);
      } catch (error) {
        console.error('Error fetching policy actions:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (service) {
      fetchPolicyActions();
    }
  }, [service]);

  const handleRetry = () => {
    setIsError(false);
    setIsLoading(true);
    // Re-trigger the effect
    setData([]);
  };

  if (isLoading) {
    return <PolicyActionsCheckboxGroupSkeleton />;
  }

  if (isError) {
    return (
      <PolicyActionsCheckboxGroupError 
        onRetry={handleRetry}
        error="Erro ao carregar ações disponíveis para este serviço"
      />
    );
  }

  return (
    <PolicyActionsCheckboxGroup
      policyActions={data}
      disabled={disabled}
      selectedActions={selectedActions}
      onChange={onChange}
      error={error}
    />
  );
};

export default PolicyActionsCheckboxGroupContainer;
