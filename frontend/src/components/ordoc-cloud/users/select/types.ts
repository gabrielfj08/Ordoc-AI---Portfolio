// Types for OrdocCloud Users Select component

export interface UserSelectContainerProps {
  value?: string;
  onChange?: (userId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  includeExternal?: boolean;
  departmentFilter?: string;
  roleFilter?: string;
}

export interface UserSelectProps {
  value?: string;
  onChange?: (userId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  users: User[];
  isLoading?: boolean;
  onSearch?: (query: string) => void;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  type: 'internal' | 'external';
  status: 'active' | 'inactive';
  department?: {
    id: string;
    name: string;
  };
  role?: {
    id: string;
    name: string;
  };
  avatar?: string;
}

export interface UserSelectOptionsProps {
  users: User[];
  selectedUserId?: string;
  onSelect: (user: User) => void;
  isLoading?: boolean;
}

export interface UserSelectEmptyProps {
  query?: string;
  onCreateUser?: () => void;
}
