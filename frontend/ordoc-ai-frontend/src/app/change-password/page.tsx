'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface PasswordRequirements {
  min_length: number;
  max_length: number;
  required_uppercase: number;
  required_lowercase: number;
  required_digits: number;
  required_special: number;
  special_chars: string;
  rules: string[];
}

interface PasswordStrength {
  score: number;
  level: string;
  feedback: string[];
}

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [requirements, setRequirements] = useState<PasswordRequirements | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // Verificar se o usuário precisa trocar a senha
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Se não precisa trocar senha, redirecionar para dashboard
    if (!user.must_change_password) {
      router.push('/dashboard');
      return;
    }
    
    // Carregar requisitos de senha
    loadPasswordRequirements();
  }, [user, router]);

  const loadPasswordRequirements = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/password-requirements/`);
      const data = await response.json();
      
      if (response.ok) {
        setRequirements(data.requirements);
      }
    } catch (error) {
      console.error('Erro ao carregar requisitos de senha:', error);
    }
  };

  const validatePasswordStrength = async (password: string) => {
    if (!password || password.length < 3) {
      setPasswordStrength(null);
      return;
    }

    setIsValidating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/validate-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          user_info: {
            name: user ? `${user.first_name} ${user.last_name}`.trim() || 'Usuário' : 'Usuário',
            email: user?.email || ''
          }
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setPasswordStrength(data.strength);
      }
    } catch (error) {
      console.error('Erro ao validar força da senha:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handlePasswordChange = (field: 'current' | 'new' | 'confirm', value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
    setError('');
    
    // Validar força da senha em tempo real
    if (field === 'new') {
      validatePasswordStrength(value);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validações básicas
    if (!passwords.new) {
      setError('Nova senha é obrigatória');
      setIsLoading(false);
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setError('Confirmação de senha não confere');
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('ordoc_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: passwords.current,
          new_password: passwords.new,
          confirm_password: passwords.confirm,
          force_change: user?.must_change_password || false
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Senha alterada com sucesso! Redirecionando...');
        
        // Aguardar um momento e redirecionar para o dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(data.error || 'Erro ao alterar senha');
        if (data.details && Array.isArray(data.details)) {
          setError(data.details.join(', '));
        }
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = (level: string) => {
    switch (level) {
      case 'Muito Forte': return 'text-green-600';
      case 'Forte': return 'text-green-500';
      case 'Média': return 'text-yellow-500';
      case 'Fraca': return 'text-orange-500';
      case 'Muito Fraca': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStrengthBgColor = (level: string) => {
    switch (level) {
      case 'Muito Forte': return 'bg-green-500';
      case 'Forte': return 'bg-green-400';
      case 'Média': return 'bg-yellow-400';
      case 'Fraca': return 'bg-orange-400';
      case 'Muito Fraca': return 'bg-red-400';
      default: return 'bg-gray-300';
    }
  };

  if (!user || !user.must_change_password) {
    return (
      <div className="fixed inset-0 z-50">
        {/* Modal Backdrop with blur */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        {/* Modal Container */}
        <div className="flex items-center justify-center min-h-full p-4">
          {/* Modal Content */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10 transform transition-all duration-300">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Modal Backdrop with blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* Modal Container */}
      <div className="flex items-center justify-center min-h-full p-4">
        {/* Modal Content */}
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10 transform transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-2xl font-bold">O</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Troca de Senha Obrigatória
            </h1>
            <p className="text-gray-600 text-sm">
              Por segurança, você deve alterar sua senha no primeiro acesso.
            </p>
          </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <XCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password - only if not force change */}
          {!user.must_change_password && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha Atual
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwords.current}
                  onChange={(e) => handlePasswordChange('current', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  required={!user.must_change_password}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nova Senha
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwords.new}
                onChange={(e) => handlePasswordChange('new', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {passwordStrength && passwords.new && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Força da senha:</span>
                  <span className={`text-sm font-medium ${getStrengthColor(passwordStrength.level)}`}>
                    {passwordStrength.level}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getStrengthBgColor(passwordStrength.level)}`}
                    style={{ width: `${passwordStrength.score}%` }}
                  ></div>
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <div className="mt-2">
                    {passwordStrength.feedback.map((feedback, index) => (
                      <p key={index} className="text-xs text-gray-600 flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1 text-yellow-500" />
                        {feedback}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Nova Senha
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwords.confirm}
                onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwords.confirm && passwords.new !== passwords.confirm && (
              <p className="mt-1 text-sm text-red-600">As senhas não conferem</p>
            )}
          </div>

          {/* Password Requirements */}
          {requirements && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Requisitos de Senha:</h3>
              <ul className="space-y-1">
                {requirements.rules.map((rule, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !passwords.new || !passwords.confirm || passwords.new !== passwords.confirm}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Alterando Senha...
              </div>
            ) : (
              'Alterar Senha'
            )}
          </button>
        </form>

          {/* Logout Option */}
          <div className="mt-6 text-center">
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Sair do Sistema
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
