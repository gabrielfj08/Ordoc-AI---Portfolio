import { IndexExternalSignature } from '../../../services/flow-cidadao/types';
import { FilterExternalSignaturesParams } from '../types';

export interface SignatureTableProps {
  data: Array<IndexExternalSignature>;
  color?: string;
}

export interface CellProps {
  signature: IndexExternalSignature;
  isFormVisible?: boolean;
  setFormVisibility?: React.Dispatch<React.SetStateAction<boolean>>;
  color?: string;
}

export interface SignatureTableContainerProps {
  params: FilterExternalSignaturesParams;
  setTotalObjects: React.Dispatch<React.SetStateAction<number>>;
}
