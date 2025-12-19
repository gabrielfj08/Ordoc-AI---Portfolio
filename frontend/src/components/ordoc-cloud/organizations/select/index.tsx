'use client';

import * as React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import organizationsService from '@/services/organizations';
import { SelectOrganizationContainerProps } from './types';
import SelectOrganizationSkeleton from './Skeleton';
import SelectOrganizationError from './Error';
import SelectOrganization from './Select';

const SelectOrganizationsContainer = ({
  name,
  onChange,
  value,
  disabled = false,
  placeholder,
}: SelectOrganizationContainerProps) => {
  const { user } = useAuth();
  const [organizations, setOrganizations] = React.useState<Array<{
    id: string;
    corporateName: string;
    cnpj?: string;
    email: string;
  }>>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch organizations from API
        const response = await organizationsService.getOrganizations({
          page_size: 100, // Get all organizations for select
        });
        
        // Transform data for select component
        const transformedOrgs = response.results.map(org => ({
          id: org.id,
          corporateName: org.corporateName,
          cnpj: org.cnpj || undefined,
          email: org.email,
        }));
        
        setOrganizations(transformedOrgs);
      } catch (err: any) {
        console.error('Error fetching organizations:', err);
        setError(err?.response?.data?.detail || err?.message || 'Erro ao carregar organizações');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  if (loading) return <SelectOrganizationSkeleton />;

  if (error) return <SelectOrganizationError />;

  return (
    <SelectOrganization
      name={name}
      onChange={onChange}
      organizations={organizations}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
    />
  );
};

export default SelectOrganizationsContainer;
