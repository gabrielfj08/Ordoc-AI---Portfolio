export interface FilterButtonProps {
  clear: () => void;
  onSubmit: (values: FilterButtonFormValues) => void;
  queryString: string;
}

export interface FilterButtonFormValues {
  createdAt: DateInterval;
  createdById: string;
  path: string;
  searchItems: Array<SearchItem>;
  sharedStatus: Array<string>;
  status: string;
  updatedAt: DateInterval;
  updatedById: string;
}

export interface SearchItem {
  q: string;
  'q.op': string;
  field: string;
}

export interface DateInterval {
  start: string;
  end: string;
}
