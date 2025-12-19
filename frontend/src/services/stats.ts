import api from './auth';

export interface UserStatistics {
  total_users: number;
  active_users: number;
  users_needing_password_change: number;
}

export interface OrganizationStatistics {
  total_organizations: number;
  active_organizations: number;
}

class StatsService {
  async getUserStatistics(): Promise<UserStatistics> {
    try {
      const response = await api.get('/api/v1/ordoc-cloud/users/stats/');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user statistics', error);
      throw new Error(
        error.response?.data?.detail || 'Erro ao carregar estat\u00edsticas de usu\u00e1rios'
      );
    }
  }

  async getOrganizationStatistics(): Promise<OrganizationStatistics> {
    try {
      const response = await api.get('/api/v1/ordoc-cloud/organizations/stats/');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching organization statistics', error);
      throw new Error(
        error.response?.data?.detail || 'Erro ao carregar estat\u00edsticas de organiza\u00e7\u00f5es'
      );
    }
  }
}

export const statsService = new StatsService();
export default statsService;
