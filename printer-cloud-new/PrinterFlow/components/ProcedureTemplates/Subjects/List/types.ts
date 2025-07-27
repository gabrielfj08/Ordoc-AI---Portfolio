import {
  IndexProcedureTemplate,
  ShowProcedureTemplate,
} from '../../../../../services/printer-flow/types/procedureTemplate';

import { FilterProcedureTemplateParams } from '../../../FilterProcedureTemplate/types';

export interface SubjectsListContainerFieldProps {
  params: FilterProcedureTemplateParams;
  setTotalObjects: React.Dispatch<React.SetStateAction<number>>;
  procedureTemplate: ShowProcedureTemplate;
}

export interface SubjectsListFieldProps {
  subjects: Array<IndexProcedureTemplate>;
  procedureTemplate: ShowProcedureTemplate;
}
