import { APIMetaProperties } from './';
import { BaseDirectory } from '../../PrinterAir/types';

export type organizationStatus = 'active' | 'inactive';

export interface IndexOrganizationParams {
  order?: string;
  direction?: string;
  status?: organizationStatus;
  q?: string;
  user_id?: number;
  page?: number;
}

export interface IndexOrganizationsAPIResponse {
  organizations: Array<IndexOrganization>;
  meta: APIMetaProperties;
}

export interface IndexOrganization {
  id: number;
  contactName: string;
  contactPhone: string;
  corporateName: string;
  cnpj: string;
  email: string;
  logoUrl: string;
  phone: string;
  prn: string;
  rootDirectory: {
    id: number;
  };
  recycleBinDirectory: {
    id: number;
  };
  site: string;
  status: organizationStatus;
  storageLimit: string;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
  apps: Array<OrganizationApp>;
}

export interface OrganizationApp {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  prn: string;
  service: string;
}

export interface OrganizationAPIResponse {
  id: number;
  contactName: string;
  contactPhone: string;
  corporateName: string;
  cnpj: string;
  email: string;
  logoUrl: string;
  phone: string;
  prn: string;
  site: string;
  status: organizationStatus;
  subdomain: string;
  storageLimit: string;
  createdAt: string;
  updatedAt: string;
  rootDirectory: BaseDirectory;
  recycleBinDirectory: BaseDirectory;
  theme: ThemeOrganization | null;
  address: OrganizationAddress | null;
}

export interface OrganizationAddress {
  id: number;
  street: string;
  number: number;
  complement: string | null;
  city: string;
  state: string;
  postalCode: string;
  neighborhood: string;
  createdAt: string;
  updatedAt: string;
}
export interface ThemeOrganization {
  id: number;
  organizationId: number;
  imageUrl: string;
  backgroundUrl: string;
  color: themeColors;
  createdAt: string;
  updatedAt: string;
}

export interface ShowOrganizationAPIResponse {
  id: number;
  contactName: string;
  contactPhone: string;
  corporateName: string;
  cnpj: string;
  email: string;
  logoUrl: string;
  phone: string;
  prn: string;
  site: string;
  status: organizationStatus;
  storageLimit: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  usersCount: number;
  apps: Array<ShowOrganizationApp>;
  address: ShowOrganizationAddress;
  rootDirectory: ShowOrganizationRootDirectory;
  recycleBinDirectory: {
    id: number;
  };
}

export interface ShowOrganizationApp {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  prn: string;
  service: string;
}

export interface ShowOrganizationAddress {
  id: number;
  street: string;
  number: string;
  complement: string;
  postalCode: string;
  city: string;
  state: string;
  neighborhood: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ShowOrganizationRootDirectory {
  id: number;
  name: string;
}

export interface UpdateOrganizationAPIResponse {
  id: number;
  contactName: string;
  contactPhone: string;
  corporateName: string;
  cnpj: string;
  email: string;
  logoUrl: string;
  phone: string;
  prn: string;
  site: string;
  status: organizationStatus;
  storageLimit: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  usersCount: number;
  apps: Array<UpdateOrganizationApp>;
  address: UpdateOrganizationAddress;
  rootDirectory: UpdateOrganizationRootDirectory | null;
  theme: ThemeOrganization | null;
}

export interface UpdateOrganizationApp {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  prn: string;
  service: string;
}

export interface UpdateOrganizationAddress {
  id: number;
  street: string;
  number: number;
  complement: string;
  postalCode: string;
  city: string;
  state: string;
  neighborhood: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UpdateOrganizationRootDirectory {
  id: number;
  name: string;
}

export type themeColors =
  | 'cidBlue'
  | 'cidCyan'
  | 'cidGold'
  | 'cidGray'
  | 'cidGreen'
  | 'cidMagenta'
  | 'cidOrange'
  | 'cidPurple';
