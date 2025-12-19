export interface ShowProfileProps {
  externalRequester: {
    id: number;
    name: string;
    email?: string;
    cpf?: string;
    cnpj?: string;
    phone?: string;
    birthDate?: string;
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
  };
}
