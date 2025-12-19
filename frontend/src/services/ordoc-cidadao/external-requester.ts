import api from '@/services/auth';
import { MeExternalRequesterAPIResponse } from './types';

export class ExternalRequesterService {
  static async show(
    token: string,
    subdomain: string,
    id: number
  ): Promise<MeExternalRequesterAPIResponse> {
    try {
      const response = await api.get(`/api/external/requesters/${id}`, {
        // Headers automáticos via interceptador
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching external requester:', error);
      throw error;
    }
  }

  static async update(
    token: string,
    subdomain: string,
    id: number,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      address?: {
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
      };
      notifications?: {
        email: boolean;
        sms: boolean;
      };
    }
  ): Promise<MeExternalRequesterAPIResponse> {
    try {
      const response = await api.put(`/api/external/requesters/${id}`, data, {
        // Headers automáticos via interceptador
      });
      return response.data;
    } catch (error) {
      console.error('Error updating external requester:', error);
      throw error;
    }
  }

  static async changePassword(
    token: string,
    subdomain: string,
    id: number,
    data: {
      currentPassword: string;
      newPassword: string;
    }
  ): Promise<{ message: string }> {
    try {
      const response = await api.post(`/api/external/requesters/${id}/change-password`, data, {
        // Headers automáticos via interceptador
      });
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  static async resetPassword(
    subdomain: string,
    email: string
  ): Promise<{ message: string }> {
    try {
      const response = await api.post('/api/external/requesters/reset-password', 
        { email },
        {
          headers: {
            'X-Subdomain': subdomain,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  static async create(
    subdomain: string,
    data: {
      name: string;
      email: string;
      cpf_cnpj: string;
      phone?: string;
      password: string;
      address?: {
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
      };
    }
  ): Promise<MeExternalRequesterAPIResponse> {
    try {
      const response = await api.post('/api/external/requesters', data, {
        headers: {
          'X-Subdomain': subdomain,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating external requester:', error);
      throw error;
    }
  }
}
