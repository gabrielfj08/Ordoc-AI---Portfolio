export interface ActionSheetContextData {
  openActionSheet: (ActionSheetComponent: React.ReactNode) => void;
  closeActionSheet: () => void;
}

export interface ActionSheetProviderProps {
  children: React.ReactNode;
}
