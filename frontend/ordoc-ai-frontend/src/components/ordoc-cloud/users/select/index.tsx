'use client';

import * as React from 'react';
import { UserSelectContainerProps, User } from './types';
import UserSelect from './Select';
import { useAuth } from '@/contexts/AuthContext';

const UserSelectContainer = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  required = false,
  includeExternal = true,
  departmentFilter,
  roleFilter,
}: UserSelectContainerProps) => {
  const { token } = useAuth();
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Fetch users from API
  const fetchUsers = React.useCallback(async (query?: string) => {
    if (!token) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (query) {
        params.append('search', query);
      }
      
      if (!includeExternal) {
        params.append('type', 'internal');
      }
      
      if (departmentFilter) {
        params.append('department', departmentFilter);
      }
      
      if (roleFilter) {
        params.append('role', roleFilter);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ordoc-cloud/users/?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Transform API response to match our User interface
        const transformedUsers: User[] = data.results?.map((apiUser: any) => ({
          id: apiUser.id,
          username: apiUser.username,
          email: apiUser.email,
          firstName: apiUser.first_name || '',
          lastName: apiUser.last_name || '',
          type: apiUser.is_external ? 'external' : 'internal',
          status: apiUser.status === 'active' ? 'active' : 'inactive',
          department: apiUser.department ? {
            id: apiUser.department.id,
            name: apiUser.department.name,
          } : undefined,
          role: apiUser.current_role ? {
            id: apiUser.current_role.id,
            name: apiUser.current_role.name,
          } : undefined,
          avatar: apiUser.avatar,
        })) || [];

        setUsers(transformedUsers);
      } else {
        console.error('Failed to fetch users:', response.statusText);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, includeExternal, departmentFilter, roleFilter]);

  // Initial load
  React.useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, includeExternal, departmentFilter, roleFilter]);

  // Handle search with debouncing
  React.useEffect(() => {
    if (!searchQuery) return;
    
    const timeoutId = setTimeout(() => {
      if (token) {
        fetchUsers(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, token]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Mock data for development/testing when API is not available
  const mockUsers: User[] = React.useMemo(() => [
    {
      id: '1',
      username: 'admin',
      email: 'admin@ordocai.com',
      firstName: 'Administrador',
      lastName: 'Sistema',
      type: 'internal',
      status: 'active',
      department: {
        id: '1',
        name: 'Administração',
      },
      role: {
        id: '1',
        name: 'Administrador',
      },
    },
    {
      id: '2',
      username: 'joao.silva',
      email: 'joao.silva@ordocai.com',
      firstName: 'João',
      lastName: 'Silva',
      type: 'internal',
      status: 'active',
      department: {
        id: '2',
        name: 'Recursos Humanos',
      },
      role: {
        id: '2',
        name: 'Analista',
      },
    },
    {
      id: '3',
      username: 'maria.santos',
      email: 'maria.santos@ordocai.com',
      firstName: 'Maria',
      lastName: 'Santos',
      type: 'internal',
      status: 'active',
      department: {
        id: '3',
        name: 'Financeiro',
      },
      role: {
        id: '3',
        name: 'Coordenador',
      },
    },
    {
      id: '4',
      username: 'cliente.externo',
      email: 'cliente@empresa.com',
      firstName: 'Cliente',
      lastName: 'Externo',
      type: 'external',
      status: 'active',
      department: {
        id: '4',
        name: 'Empresa XYZ',
      },
    },
    {
      id: '5',
      username: 'pedro.costa',
      email: 'pedro.costa@ordocai.com',
      firstName: 'Pedro',
      lastName: 'Costa',
      type: 'internal',
      status: 'inactive',
      department: {
        id: '2',
        name: 'Recursos Humanos',
      },
      role: {
        id: '2',
        name: 'Analista',
      },
    },
  ], []);

  // Use mock data if no real users loaded and not loading
  const displayUsers = users.length > 0 ? users : (!isLoading ? mockUsers : []);

  return (
    <UserSelect
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      error={error}
      required={required}
      users={displayUsers}
      isLoading={isLoading}
      onSearch={handleSearch}
    />
  );
};

export default UserSelectContainer;
