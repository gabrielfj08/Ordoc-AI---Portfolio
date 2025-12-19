import { ShowExternalProcedureAPIResponse } from '@/services/ordoc-cidadao/types';

export interface ShowProcedureProps {
  procedure: {
    id: number;
    status: string;
    createdAt: string;
    requesterId: number;
    requester: {
      name: string;
      email: string;
    };
    parentProcedureTemplateName: string;
    procedureTemplateName: string;
    responsibleGroup: {
      name: string;
    };
    payload: any[];
  };
  generateReport: () => void;
}

export interface ShowProcedureContainerProps {
  setProcedureName: React.Dispatch<React.SetStateAction<string>>;
}
