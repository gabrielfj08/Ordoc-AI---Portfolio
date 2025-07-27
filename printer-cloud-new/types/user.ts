import { userStatus } from './status';

export type User = {
  id: number | null;
  name: string;
  email: string;
  cpf: string;
  dateOfBirth: string;
  avatarUrl: string;
  phone: string;
  status: userStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  organizationsCount: number | null;
  userGroupsCount: number | null;
};

export type profile = 'Administrador' | 'Gerente' | 'Usuário';
