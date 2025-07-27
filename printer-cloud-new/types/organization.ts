import { status } from './status';
import { App } from './app';
import { Address } from './address';

// TODO: DEPRECATE THIS TYPE AND USE FACTORY AND CLASS CONSTRUCTOR TO CREATE OBJECTS
export type Organization = {
  id: number;
  address: Address;
  contact_name: string;
  contact_phone: string;
  corporate_name: string;
  cnpj: string;
  email: string;
  logo_url: string;
  phone: string;
  site: string;
  status: status;
  storage_limit: string;
  apps: Array<App>;
};

// TODO: CHANGE Organization TO HAVE IOrganiztion INTERFACE
export type IOrganization = {
  id: number;
  address: Address;
  contactName: string;
  contactPhone: string;
  corporateName: string;
  cnpj: string;
  email: string;
  logoUrl: string;
  phone: string;
  site: string;
  status: status;
  storageLimit: string;
  apps: Array<App>;
};
