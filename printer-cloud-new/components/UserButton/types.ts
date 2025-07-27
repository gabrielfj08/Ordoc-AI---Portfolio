export interface UserButtonContainerProps {
  currentOrganizationId: number;
  onClick?: React.MouseEventHandler;
}

export interface UserButtonProps {
  className?: string;
  currentOrganizationId: number;
  onClick?: React.MouseEventHandler;
  user: any;
}
