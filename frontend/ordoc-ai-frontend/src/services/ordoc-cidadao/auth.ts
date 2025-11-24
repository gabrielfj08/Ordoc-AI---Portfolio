// Importar instância centralizada
import api from '@/services/auth';
import { LoginFormValues, LoginAPIResponse } from '@/types/ordoc-cidadao';

export class RequesterAuth {
  static async login(values: LoginFormValues): Promise<LoginAPIResponse> {
    const response = await api.post('/flow-cidadao/auth/login', {
      cpf_cnpj: values.cpfCnpj.replace(/\D/g, ''),
      password: values.password
    });
    return response;
  }

  static async recaptcha(token: string | null, secret: string) {
    const response = await api.post('/flow-cidadao/auth/recaptcha', {
      token,
      secret
    });
    return response;
  }

  static async logout() {
    const response = await api.post('/flow-cidadao/auth/logout');
    return response;
  }

  static async me() {
    const response = await api.get('/flow-cidadao/auth/me');
    return response;
  }

  static async changePassword(currentPassword: string, newPassword: string) {
    const response = await api.patch('/flow-cidadao/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword
    });
    return response;
  }

  static async recoverPassword(cpfCnpj: string) {
    const response = await api.post('/flow-cidadao/auth/recover-password', {
      cpf_cnpj: cpfCnpj.replace(/\D/g, '')
    });
    return response;
  }

  static async generateOtp(token: string, subdomain: string, payload: { cpfCnpj: string }) {
    const response = await api.post('/flow-cidadao/auth/generate-otp', {
      cpf_cnpj: payload.cpfCnpj.replace(/\D/g, '')
    });
    return response;
  }

  static async resetPassword(token: string, password: string) {
    const response = await api.post('/flow-cidadao/auth/reset-password', {
      token,
      password
    });
    return response;
  }

  static async unlockAccount(cpfCnpj: string) {
    const response = await api.post('/flow-cidadao/auth/unlock-account', {
      cpf_cnpj: cpfCnpj.replace(/\D/g, '')
    });
    return response;
  }

  static async updatePassword(payload: { currentPassword: string; password: string }) {
    const response = await api.put('/flow-cidadao/auth/password', payload);
    return response;
  }
}

// Alias para compatibilidade
export const ExternalAuthService = RequesterAuth;
