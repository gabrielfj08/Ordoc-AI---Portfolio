import api from './auth';

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
  updated_at?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
  role?: string;
  password?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  cpf?: string;
  phone?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'pending' | 'blocked';
}

export interface UsersListParams {
  q?: string;
  status?: string;
  role?: string;
  page?: number;
  per_page?: number;
  order?: string;
  direction?: 'asc' | 'desc';
}

export interface UsersListResponse {
  users: User[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

class UsersService {
  async getUsers(params: UsersListParams = {}): Promise<UsersListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.q) searchParams.append('q', params.q);
    if (params.status) searchParams.append('status', params.status);
    if (params.role) searchParams.append('role', params.role);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params.order) searchParams.append('order', params.order);
    if (params.direction) searchParams.append('direction', params.direction);

    const response = await api.get(`/api/v1/ordoc-cloud/users/?${searchParams.toString()}`);
    return response.data;
  }

  async getUser(userId: string): Promise<User> {
    const response = await api.get(`/api/v1/ordoc-cloud/users/${userId}/`);
    return response.data;
  }

  async createUser(userData: CreateUserData): Promise<User> {
    try {
      const response = await api.post('/api/v1/ordoc-cloud/users/', userData);
      return response.data;
    } catch (error: any) {
      // Handle axios errors with better error messages
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          throw new Error('Não autorizado. Faça login novamente.');
        } else if (status === 403) {
          throw new Error('Sem permissão para criar usuários.');
        } else if (status === 400) {
          // Validation errors from backend
          const errorMsg = data?.error || data?.detail || 'Dados inválidos fornecidos.';
          throw new Error(errorMsg);
        } else if (status >= 500) {
          throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
        } else {
          throw new Error(data?.error || data?.detail || `Erro ${status}: ${error.response.statusText}`);
        }
      } else if (error.request) {
        // Network error
        throw new Error('Erro de conexão. Verifique se o servidor está funcionando.');
      } else {
        // Other error
        throw new Error(error.message || 'Erro inesperado ao criar usuário.');
      }
    }
  }

  async updateUser(userId: string, userData: UpdateUserData): Promise<User> {
    const response = await api.patch(`/api/v1/ordoc-cloud/users/${userId}/`, userData);
    return response.data;
  }

  async deleteUser(userId: string): Promise<void> {
    await api.delete(`/api/v1/ordoc-cloud/users/${userId}/`);
  }

  async sendPasswordReset(userId: string): Promise<void> {
    await api.post(`/api/v1/ordoc-cloud/users/${userId}/send-password/`);
  }

  async toggleUserStatus(userId: string): Promise<User> {
    const response = await api.patch(`/api/v1/ordoc-cloud/users/${userId}/toggle-status/`);
    return response.data;
  }
}

export const usersService = new UsersService();
