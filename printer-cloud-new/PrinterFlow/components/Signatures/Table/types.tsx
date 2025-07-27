import { menuOptions } from '../../../../components/MenuButton/types';
import {
  BaseProcedure,
  ShowSignatureAPIResponse,
  IndexSignature,
  signatureStatus,
} from '../../../../services/printer-flow/types';

export interface SignaturesTableProps {
  data: any;
  filter: signatureStatus;
}

export interface CellsContainerProps {
  signature: IndexSignature;
}

export interface SignableTypeCellProps {
  signature: IndexSignature;
}

export interface DocumentNameCellProps {
  signature: IndexSignature;
}

export interface ProcedureCellProps {
  procedure: BaseProcedure;
}

export interface RequesterCellProps {
  signature: IndexSignature;
}

export interface RequestedAtCellProps {
  requestedAt: string;
}

export interface StatusCellProps {
  signature: ShowSignatureAPIResponse;
}

export interface MenuButtonCellProps {
  options: Array<menuOptions>;
}
