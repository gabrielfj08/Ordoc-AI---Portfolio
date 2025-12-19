export interface User {
  id: string;
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'pending' | 'blocked';
  role?: string;
  organization?: string;
  created_at: string;
}

export interface UserSelectOptionsContainerProps {
  query: string;
}

export interface SelectUserOptionsProps {
  users: Array<User>;
}
