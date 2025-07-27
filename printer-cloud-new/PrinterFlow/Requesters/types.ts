import {
  RequestersStatus,
  RequesterType,
} from '../../services/printer-flow/types';

export interface RequesterProps {
  params: FilterRequesterParams;
  setParams: React.Dispatch<React.SetStateAction<FilterRequesterParams>>;
}
export interface FilterRequesterParams {
  direction: string;
  order: string;
  page: number;
  perPage: number;
  q: string;
  status: RequestersStatus;
  type: RequesterType;
}
