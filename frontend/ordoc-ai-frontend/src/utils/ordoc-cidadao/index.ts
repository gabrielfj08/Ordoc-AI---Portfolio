// Máscaras e utilitários para CPF/CNPJ
export const cpfCnpjMask = (value: string | undefined) => {
  if (!value) return '';
  value = value.replace(/\D/g, '');

  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1-$2');
  } else {
    value = value.replace(/(\d{2})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
  }

  return value;
};

export const cpfMask = (value: string | undefined) => {
  if (!value) return '';
  value = value.replace(/\D/g, '');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1-$2');
  return value;
};

export const cnpjMask = (value: string | undefined) => {
  if (!value) return '';
  value = value.replace(/\D/g, '');
  value = value.replace(/(\d{2})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1/$2');
  value = value.replace(/(\d{4})(\d)/, '$1-$2');
  return value;
};

export const phoneMask = (value: string | undefined) => {
  if (!value) return '';
  value = value.replace(/\D/g, '');
  
  if (value.length <= 10) {
    value = value.replace(/(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    value = value.replace(/(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
  }
  
  return value;
};

// Alias para compatibilidade
export const phoneNumberMask = phoneMask;

export const postalCodeMask = (value: string | undefined) => {
  if (!value) return '';
  value = value.replace(/\D/g, '');
  value = value.replace(/(\d{5})(\d)/, '$1-$2');
  return value;
};

export const emailMask = (value: string | undefined) => {
  if (!value) return '';
  return value.toLowerCase().trim();
};

// Validadores
export const noEmojiValidator = (value: string) => {
  // Simplified emoji detection without unicode escapes
  const emojiRegex = /[\u2600-\u27BF]|[\uD83C][\uDF00-\uDFFF]|[\uD83D][\uDC00-\uDE4F]|[\uD83D][\uDE80-\uDEFF]/g;
  return !emojiRegex.test(value);
};

export const validateDate = (dateString: string) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

// Utilitários de string
export const getSubdomain = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    return parts.length > 2 ? parts[0] : 'localhost';
  }
  return 'localhost';
};

export const generateUsername = (name: string) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 20);
};

export const removeFileExtension = (filename: string) => {
  return filename.replace(/\.[^/.]+$/, '');
};

export const getFileBasename = (path: string) => {
  return path.split('/').pop() || '';
};

// Conversores de caso
export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

// Utilitários de array
export const removeDuplicates = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

// Utilitários de query string
export const toQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
};

export const buildParams = (params: Record<string, any>): Record<string, any> => {
  const cleanParams: Record<string, any> = {};
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      cleanParams[key] = value;
    }
  });
  
  return cleanParams;
};
