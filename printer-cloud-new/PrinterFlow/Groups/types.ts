export interface GroupRequestersPageProps {
  params: FilterGroupsParams;
  setParams: React.Dispatch<React.SetStateAction<FilterGroupsParams>>;
}

export interface FilterGroupsParams {
  direction: string;
  order: string;
  page: number;
  perPage: number;
  q: string;
  status: GroupRequesterStatus;
}

export type GroupRequesterStatus = 'active' | 'inactive' | '';
