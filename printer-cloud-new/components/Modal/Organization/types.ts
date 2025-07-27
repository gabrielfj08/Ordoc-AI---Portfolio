export interface OrganizationModalProps {
  id: number;
  name: string;
}
export interface RemoveUserProps {
  id: number;
  userName?: string;
}
export interface AddUserProps {
  organization_id?: number | null | undefined;
}
