export interface FlowFilterButtonProps {
  children: React.ReactNode;
  params: FilterGroupsParams | FilterRequesterParams | any;
  setParams: React.Dispatch<
    React.SetStateAction<FilterGroupsParams | FilterRequesterParams | any>
  >;
  filterType: 'requester' | 'groupRequester';
}
export interface FlowFilterButtonContainerProps {
  children: React.ReactNode;
  params: FilterGroupsParams | FilterRequesterParams | any;
  setParams: React.Dispatch<
    React.SetStateAction<FilterGroupsParams | FilterRequesterParams | any>
  >;
  filterType: 'requester' | 'groupRequester';
}
export interface FilterGroupsParams {
  order: string;
  direction: string;
  page: number;
  perPage: number;
  q: string;
  status: GroupRequesterStatus;
}

export type GroupRequesterStatus = 'active' | 'inactive' | '';

export interface FilterRequesterParams {
  order: string;
  direction: string;
  page: number;
  perPage: number;
  q: string;
  status: RequesterStatus;
  type: RequesterType;
}

export type RequesterStatus = 'active' | 'inactive' | '';

export type RequesterType =
  | 'PrinterFlow::InternalRequester'
  | 'PrinterFlow::ExternalRequester'
  | '';
