import { User as UserType } from '../../types/user';
export interface LayoutProps {
  children?: React.ReactNode;
  className?: string;
  user?: UserType;
}
export interface LayoutHeaderProps {
  children?: React.ReactNode;
  className?: string;
  button?: string;
  icon?: string;
  title?: string;
}
export interface LayoutContainerProps {
  children: React.ReactNode;
}
