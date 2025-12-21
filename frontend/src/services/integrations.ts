
import api from './auth';

export interface CNPJData {
    valid: boolean;
    cnpj: string;
    source: string;
    company: {
        nome: string;
        fantasia: string;
        situacao: string;
        tipo: string;
        porte: string;
        natureza_juridica: string;
        capital_social: string;
        abertura: string;
        email: string;
        telefone: string;
    };
    address: {
        logradouro: string;
        numero: string;
        complemento: string;
        bairro: string;
        municipio: string;
        uf: string;
        cep: string;
    };
    updated_at: string;
}

class IntegrationsService {
    async validateCNPJ(cnpj: string): Promise<CNPJData> {
        const response = await api.post('/api/v1/integrations/execute/validate-cnpj/', { cnpj });
        return response.data;
    }
}

export const integrationsService = new IntegrationsService();
