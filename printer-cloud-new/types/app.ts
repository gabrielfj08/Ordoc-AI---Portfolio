type appNames =
  | 'Printer Air'
  | 'Printer Flow'
  | 'Printer Reports'
  | 'Printer Cloud'
  | '';

export type App = {
  id?: number;
  name: appNames;
};
