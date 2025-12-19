export interface ExternalRequesterProfileProps {
  externalRequester: {
    id: number;
    name: string;
    email?: string;
    cpf?: string;
    cnpj?: string;
    phone?: string;
    birthDate?: string;
  };
  type: 'show' | 'edit';
  setType: (type: 'show' | 'edit') => void;
}
