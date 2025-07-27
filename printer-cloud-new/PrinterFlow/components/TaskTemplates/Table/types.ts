import { IndexTaskTemplate } from '../../../../services/printer-flow/types';
import { FilterTaskTemplateParams } from '../../../TaskTemplates/types';

export interface TaskTemplatesTableContainerProps {
  params: FilterTaskTemplateParams;
  setTotalObjects: React.Dispatch<React.SetStateAction<number>>;
}

export interface TaskTemplatesTableProps {
  data: Array<IndexTaskTemplate>;
}
