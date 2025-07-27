// Types for Users/Modals/Show component - Ordoc-AI Frontend
// Migrated from PrinterCloud to modern TypeScript with UUID support

export interface ShowUserModalContainerProps {
  userId: string; // UUID string instead of number
}

export interface ShowUserModalProps {
  user: User;
  onClose: () => void;
}

export interface User {
  id: string;
  name: string;
  email: string;
  cpf?: string;
  dateOfBirth?: string;
  phone?: string;
  registrationNumber?: string;
  username: string;
  status: UserStatus;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
}

export type UserStatus = 'active' | 'inactive' | 'pending' | 'blocked';

export interface SendPasswordProps {
  userId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export interface SendPasswordResponse {
  message: string;
  success: boolean;
}
