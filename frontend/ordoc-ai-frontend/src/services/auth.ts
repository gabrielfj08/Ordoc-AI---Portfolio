import axios, { AxiosResponse } from 'axios';

// Types
interface LoginResponse {
  user: {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    type: string;
    status: string;
    must_change_password?: boolean;
  };
  token: string;
  organization?: {
    id: string;
    name: string;
    subdomain: string;
  } | null;
  expires_at: string;
}

interface ApiError {
  error: string;
  status: number;
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include subdomain and auth token
api.interceptors.request.use((config) => {
  // Get subdomain from hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    
    // Only add subdomain if it's not localhost or IP
    if (subdomain && !hostname.includes('localhost') && !hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      config.headers['X-Api-Subdomain'] = subdomain;
    }
  }
  
  // TEMPORARY: Add hardcoded subdomain for testing
  config.headers['X-Api-Subdomain'] = 'demo';
  
  // Add auth token if available
  const token = localStorage.getItem('ordoc_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('🔍 API Error Interceptor:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers
    });
    
    if (error.response?.status === 401) {
      console.warn('🔒 Token expired or invalid - redirecting to login');
      // Token expired or invalid
      localStorage.removeItem('ordoc_token');
      if (typeof window !== 'undefined') {
        // Don't redirect immediately, let the component handle it
        console.log('🔄 Token removed, component should handle redirect');
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  /**
   * Login user
   */
  async login(email: string, password: string, userType: 'internal' | 'external' = 'internal', turnstileToken?: string): Promise<LoginResponse> {
    try {
      const requestData: any = {
        email,
        password,
        user_type: userType,
      };
      
      // Add Turnstile token if provided for anti-bot verification
      if (turnstileToken) {
        requestData.turnstile_token = turnstileToken;
      }
      
      console.log('Making login request:', {
        url: `${API_BASE_URL}/api/auth/login/`,
        data: { ...requestData, password: '[HIDDEN]' },
        headers: api.defaults.headers
      });
      
      const response: AxiosResponse<LoginResponse> = await api.post('/api/auth/login/', requestData);
      
      return response.data;
    } catch (error: any) {
      console.error('Login error details:', {
        message: error?.message || 'Unknown error',
        code: error?.code || 'NO_CODE',
        response: error?.response?.data || null,
        status: error?.response?.status || null,
        statusText: error?.response?.statusText || null,
        url: error?.config?.url || null,
        method: error?.config?.method || null,
        fullError: error
      });
      
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Não foi possível conectar com o servidor. Verifique se o backend está rodando.');
      } else if (error.code === 'ETIMEDOUT') {
        throw new Error('Timeout na conexão com o servidor.');
      } else if (error.response) {
        const apiError: ApiError = error.response.data || { error: 'Login failed', status: error.response.status };
        throw new Error(apiError.error);
      } else {
        throw new Error(`Erro de rede: ${error.message}`);
      }
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout/');
    } catch (error) {
      // Even if logout fails on server, we should clear local storage
      console.warn('Logout request failed, but continuing with local cleanup');
    } finally {
      localStorage.removeItem('ordoc_token');
    }
  },

  /**
   * Validate token and get user data
   */
  async validateToken(token: string): Promise<LoginResponse['user']> {
    try {
      const response: AxiosResponse<{ user: LoginResponse['user'] }> = await api.get('/api/auth/me/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return response.data.user;
    } catch (error: any) {
      const apiError: ApiError = error.response?.data || { error: 'Token validation failed', status: 401 };
      throw new Error(apiError.error);
    }
  },

  /**
   * Refresh token
   */
  async refreshToken(currentToken: string): Promise<string> {
    try {
      const response: AxiosResponse<{ token: string }> = await api.post('/api/auth/refresh/', {}, {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
        },
      });
      
      return response.data.token;
    } catch (error: any) {
      const apiError: ApiError = error.response?.data || { error: 'Token refresh failed', status: 401 };
      throw new Error(apiError.error);
    }
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await api.post('/api/auth/password-reset/', { email });
    } catch (error: any) {
      const apiError: ApiError = error.response?.data || { error: 'Password reset request failed', status: 500 };
      throw new Error(apiError.error);
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post('/api/auth/password-reset/confirm/', {
        token,
        new_password: newPassword,
      });
    } catch (error: any) {
      const apiError: ApiError = error.response?.data || { error: 'Password reset failed', status: 500 };
      throw new Error(apiError.error);
    }
  },

  /**
   * Change password for authenticated user
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await api.post('/api/auth/change-password/', {
        current_password: currentPassword,
        new_password: newPassword,
      });
    } catch (error: any) {
      const apiError: ApiError = error.response?.data || { error: 'Password change failed', status: 500 };
      throw new Error(apiError.error);
    }
  },
};

export default api;
