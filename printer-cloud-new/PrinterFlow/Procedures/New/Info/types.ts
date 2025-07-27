import { IndexProcedureTemplate } from '../../../../services/printer-flow/types/procedureTemplate';
import {
  CreateProcedureAPIResponse,
  procedurePriority,
  ProcedureRequester,
  procedureSource,
  ShowProcedureAPIResponse,
} from '../../../../services/printer-flow/types';

export interface NewProcedureInfoProps {
  onSubmit: (
    values: NewProcedureInfoFormValues
  ) => Promise<CreateProcedureAPIResponse>;
  requesters: ProcedureRequester;
  procedureTemplates: IndexProcedureTemplate;
}

export interface NewProcedureInfoFormValues {
  priority: procedurePriority;
  source: procedureSource;
  private: boolean;
  deadline: string;
  requesterId: number | null;
  procedureTemplateId: number | null;
  subjectTemplateId?: number | null;
}

export interface NewProcedureInfoContainerProps {
  requesters: ProcedureRequester;
  procedureTemplates: IndexProcedureTemplate;
  setProcedureData: React.Dispatch<
    React.SetStateAction<ShowProcedureAPIResponse>
  >;
}
