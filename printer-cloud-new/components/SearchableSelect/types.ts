export interface Item {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  name?: string;
  items: Array<Item>;
  itemHandleClick?: React.MouseEventHandler;
  isDisabled?: boolean;
  isLinkable?: boolean;
  isSearchable?: boolean;
  isClearable?: boolean;
  linkLabel?: string;
  noOptionsMessage?: string;
  placeholder?: string;
  defaultValue?: Item;
  selectedItem: Item | unknown;
  setSelectedItem: any;
  w?: searchableSelectWidth;
}

export const widthMapping: Record<string, string> = {
  40: '160px', //w-40,
  44: '176px', //w-44,
  48: '192px', //w-48,
  52: '208px', //w-52,
  56: '224px', //w-56,
  60: '240px', //w-60,
  64: '256px', //w-64,
  72: '288px', //w-72,
  80: '320px', //w-80,
  96: '384px', //w-96,
  112: '448px', //w-[28rem]
  128: '512px', //w-[32rem]
  144: '576px', //w-[36rem]
  160: '640px', //w-[40rem]
};

export type searchableSelectWidth =
  | 40
  | 44
  | 48
  | 52
  | 56
  | 60
  | 64
  | 72
  | 80
  | 96
  | 112
  | 128
  | 144
  | 160;
