import { Address, App } from '.';
import { organizationStatus } from '../types';

export class Organization {
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
  status: organizationStatus;
  storageLimit: string;
  apps: Array<App>;

  constructor(organization) {
    this.id = organization.id;
    this.address = organization.address;
    this.contactName = organization.contactName;
    this.contactPhone = organization.contactPhone;
    this.corporateName = organization.corporateName;
    this.cnpj = organization.cnpj;
    this.email = organization.email;
    this.logoUrl = organization.logoUrl;
    this.phone = organization.phone;
    this.site = organization.site;
    this.status = organization.status;
    this.storageLimit = organization.storageLimit;
    this.apps = organization.apps;
  }

  static create(data) {
    data.address = data.address || {};
    data.apps = data.apps || [];

    return new Organization({
      id: data.id,
      address: Address.create(data.address),
      contactName: data.contact_name,
      contactPhone: data.contact_phone,
      corporateName: data.corporate_name,
      cnpj: data.cnpj,
      email: data.email,
      logoUrl: data.logo_url,
      phone: data.phone,
      site: data.site,
      status: data.status,
      storageLimit: data.storage_limit,
      apps: data.apps.map((appData) => App.create(appData)),
    });
  }
}
