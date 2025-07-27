import { Params } from 'next/dist/server/router';
import { IndexProceduresPayload } from '../../../services/printer-flow/types';

export interface SearchProps {
  params: IndexProceduresPayload;
  setParams: React.Dispatch<React.SetStateAction<IndexProceduresPayload>>;
  onSubmit: (params: IndexProceduresPayload) => Promise<IndexProceduresPayload>;
}
