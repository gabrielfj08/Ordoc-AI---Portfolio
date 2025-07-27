import client from '../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  ShowOrganizationAPIResponse,
  UpdateOrganizationAPIResponse,
} from '../../../../../services/types';

const transformShowData = (data): ShowOrganizationAPIResponse => {
  return {
    id: data.id,
    contactName: data.contact_name,
    contactPhone: data.contact_phone,
    corporateName: data.corporate_name,
    cnpj: data.cnpj,
    email: data.email,
    logoUrl: data.logo_url,
    phone: data.phone,
    prn: data.prn,
    site: data.site,
    status: data.status,
    storageLimit: data.storage_limit,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    deletedAt: data.deleted_at,
    usersCount: data.users_count,
    apps: data.apps.map((app) => ({
      id: app.id,
      name: app.name,
      createdAt: app.created_at,
      updatedAt: app.updated_at,
      description: app.description,
      prn: app.prn,
      service: app.service,
    })),
    address: {
      id: data.address.id,
      street: data.address.street,
      number: data.address.number,
      complement: data.address.complement,
      postalCode: data.address.postal_code,
      city: data.address.city,
      state: data.address.state,
      neighborhood: data.address.neighborhood,
      createdAt: data.address.created_at,
      updatedAt: data.address.updated_at,
      deletedAt: data.address.deleted_at,
    },
    rootDirectory: data.root_directory,
    recycleBinDirectory: {
      id: data.recycle_bin_directory.id,
    },
  };
};

const transformUpdateData = (data): UpdateOrganizationAPIResponse => {
  return {
    id: data.id,
    contactName: data.contact_name,
    contactPhone: data.contact_phone,
    corporateName: data.corporate_name,
    cnpj: data.cnpj,
    email: data.email,
    logoUrl: data.logo_url,
    phone: data.phone,
    prn: data.prn,
    site: data.site,
    status: data.status,
    storageLimit: data.storage_limit,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    deletedAt: data.deleted_at,
    usersCount: data.users_count,
    apps: data.apps.map((app) => ({
      id: app.id,
      name: app.name,
      createdAt: app.created_at,
      updatedAt: app.updated_at,
      description: app.description,
      prn: app.prn,
      service: app.service,
    })),
    address: {
      id: data.address.id,
      street: data.address.street,
      number: data.address.number,
      complement: data.address.complement,
      postalCode: data.address.postal_code,
      city: data.address.city,
      state: data.address.state,
      neighborhood: data.address.neighborhood,
      createdAt: data.address.created_at,
      updatedAt: data.address.updated_at,
      deletedAt: data.address.deleted_at,
    },
    rootDirectory: data.root_directory
      ? {
          id: data.root_directory.id,
          name: data.root_directory.name,
        }
      : null,
    theme: data.theme
      ? {
          id: data.id,
          organizationId: data.organization_id,
          imageUrl: data.image_url,
          backgroundUrl: data.background_url,
          color: data.color,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
      : null,
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const config = {
    headers: {
      Authorization: `Bearer ${req.headers.token}`,
      'X-Api-Subdomain': req.headers['x-api-subdomain'] as string,
      'X-Forwarded-For': req.headers['x-forwarded-for']
        ? (req.headers['x-forwarded-for'] as string).split(',')[0]
        : req.headers['x-real-ip']
        ? (req.headers['x-real-ip'] as string)
        : (req.socket.remoteAddress as string),
    },
  };

  switch (req.method) {
    case 'GET':
      return client
        .get(
          `/v3/printer_cloud/organizations/${req.query.organizationId}`,
          config
        )
        .then((response) => {
          res.status(response.status).json(transformShowData(response.data));
        })
        .catch((error) => {
          if (error.response?.data?.message) {
            res.status(error.response.status).json(error.response.data);
          } else {
            res.status(error.response?.status || 500).json({
              message:
                'Um erro inesperado ocorreu. Tente novamente mais tarde.',
            });
          }
        });

    case 'PUT':
      return client
        .put(
          `/v3/printer_cloud/organizations/${req.query.organizationId}`,
          {
            organization: {
              corporate_name: req.body.organization.corporateName,
              email: req.body.organization.email,
              phone: req.body.organization.phone,
              contact_name: req.body.organization.contactName,
              contact_phone: req.body.organization.contactPhone,
              storage_limit: req.body.organization.storageLimit,
              site: req.body.organization.site,
              logo_url: req.body.organization.logoUrl,
              app_ids: req.body.organization.appIds,
            },
            address: {
              street: req.body.address.street,
              number: req.body.address.number,
              complement: req.body.address.complement,
              postal_code: req.body.address.postalCode,
              city: req.body.address.city,
              state: req.body.address.state,
              neighborhood: req.body.address.neighborhood,
            },
          },
          config
        )
        .then((response) => {
          res.status(response.status).json(transformUpdateData(response.data));
        })
        .catch((error) => {
          if (error.response?.data?.message) {
            res.status(error.response.status).json(error.response.data);
          } else {
            res.status(error.response?.status || 500).json({
              message:
                'Um erro inesperado ocorreu. Tente novamente mais tarde.',
            });
          }
        });
  }
}
