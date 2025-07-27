'use client';

import * as React from 'react';
import { UserSelectProps, User } from './types';

const UserSelect = ({
  value,
  onChange,
  placeholder = 'Selecione um usuário',
  disabled = false,
  error,
  required = false,
  users,
  isLoading = false,
  onSearch,
}: UserSelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  // Find selected user when value changes
  React.useEffect(() => {
    if (value) {
      const user = users.find(u => u.id === value);
      setSelectedUser(user || null);
    } else {
      setSelectedUser(null);
    }
  }, [value, users]);

  // Filter users based on search query
  const filteredUsers = React.useMemo(() => {
    if (!query.trim()) return users;
    
    const searchTerm = query.toLowerCase();
    return users.filter(user => 
      user.username.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.department?.name.toLowerCase().includes(searchTerm)
    );
  }, [users, query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    if (onSearch) {
      onSearch(newQuery);
    }
    
    if (!isOpen && newQuery) {
      setIsOpen(true);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setQuery('');
    setIsOpen(false);
    
    if (onChange) {
      onChange(user.id);
    }
  };

  const handleClear = () => {
    setSelectedUser(null);
    setQuery('');
    setIsOpen(false);
    
    if (onChange) {
      onChange('');
    }
  };

  const getUserDisplayName = (user: User): string => {
    const fullName = `${user.firstName} ${user.lastName}`.trim();
    return fullName || user.username;
  };

  const getUserAvatar = (user: User): string => {
    if (user.avatar) return user.avatar;
    
    // Generate initials from name
    const fullName = `${user.firstName} ${user.lastName}`.trim();
    if (fullName) {
      return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user.username.slice(0, 2).toUpperCase();
  };

  const displayValue = selectedUser ? getUserDisplayName(selectedUser) : query;

  return (
    <div className="relative">
      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`
            w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent
            ${error 
              ? 'border-red-300 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
        />
        
        {/* Icons */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
          {selectedUser && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          <div className="p-1 text-gray-400">
            {isLoading ? (
              <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown Options */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full mr-2"></div>
              <span className="text-gray-600">Carregando usuários...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="px-4 py-3 text-center text-gray-500">
              {query ? (
                <div>
                  <p>Nenhum usuário encontrado para "{query}"</p>
                  <p className="text-xs mt-1">Tente buscar por nome, email ou departamento</p>
                </div>
              ) : (
                <p>Nenhum usuário disponível</p>
              )}
            </div>
          ) : (
            <div className="py-1">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleUserSelect(user)}
                  className={`
                    w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none
                    ${selectedUser?.id === user.id ? 'bg-blue-100' : ''}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white
                      ${user.type === 'internal' ? 'bg-blue-500' : 'bg-green-500'}
                    `}>
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                      ) : (
                        getUserAvatar(user)
                      )}
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {getUserDisplayName(user)}
                        </p>
                        <span className={`
                          px-2 py-1 text-xs font-medium rounded-full
                          ${user.type === 'internal' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                          }
                        `}>
                          {user.type === 'internal' ? 'Interno' : 'Externo'}
                        </span>
                        {user.status === 'inactive' && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            Inativo
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        {user.department && (
                          <span className="text-xs text-gray-400">• {user.department.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-sm mt-1 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default UserSelect;
