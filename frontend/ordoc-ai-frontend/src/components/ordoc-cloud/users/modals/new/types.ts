// Types for OrdocCloud Users New Modal component

export interface NewUserModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated?: (user: User) => void;
}

export interface NewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: NewUserFormValues) => Promise<CreateUserResponse>;
  isLoading?: boolean;
  error?: string;
}

export interface NewUserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone?: string;
  cpf?: string;
  dateOfBirth?: string;
  registrationNumber?: string;
  department?: string;
  role: string;
  mustChangePassword: boolean;
  sendWelcomeEmail: boolean;
}

export interface CreateUserResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  mustChangePassword: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  type: 'internal' | 'external';
  status: 'active' | 'inactive' | 'pending' | 'blocked';
  phone?: string;
  cpf?: string;
  dateOfBirth?: string;
  registrationNumber?: string;
  department?: {
    id: string;
    name: string;
  };
  role?: {
    id: string;
    name: string;
  };
  avatar?: string;
  mustChangePassword: boolean;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  code: string;
  description?: string;
}
