export interface FilterButtonProps {
  children: React.ReactNode;
  status: string | undefined;
  organization_id: any;
  onReset: () => void;
  onClick: () => void;
}
