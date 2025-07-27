import client from '../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { IndexOrganizationsAPIResponse } from '../../../../services/types';

const transformData = (data): IndexOrganizationsAPIResponse => {
  return {
    organizations: data.organizations.map((organizationData) => {
      return {
        id: organizationData.id,
        contactName: organizationData.contact_name,
        contactPhone: organizationData.contact_phone,
        corporateName: organizationData.corporate_name,
        cnpj: organizationData.cnpj,
        email: organizationData.email,
        logoUrl: organizationData.logo_url,
        phone: organizationData.phone,
        prn: organizationData.prn,
        rootDirectory: {
          id: organizationData.root_directory.id,
          path: organizationData.root_directory.path,
        },
        recycleBinDirectory: {
          id: organizationData.recycle_bin_directory.id,
        },
        site: organizationData.site,
        status: organizationData.status,
        storageLimit: organizationData.storage_limit,
        deletedAt: organizationData.deleted_at,
        createdAt: organizationData.created_at,
        updatedAt: organizationData.updated_at,
        apps: organizationData.apps.map((organizationAppData) => {
          return {
            id: organizationAppData.id,
            name: organizationAppData.name,
            createdAt: organizationAppData.createdAt,
            updatedAt: organizationAppData.updatedAt,
            description: organizationAppData.description,
            prn: organizationAppData.prn,
            service: organizationAppData.service,
          };
        }),
      };
    }),
    meta: {
      total: data.meta.total,
    },
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

  const queryString = new URLSearchParams(
    req.query as Record<string, string>
  ).toString();

  return client
    .get(`/v3/printer_cloud/organizations?${queryString}`, config)
    .then((response) => {
      res.status(response.status).json(transformData(response.data));
    })
    .catch((error) => {
      if (error.response?.data?.message) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(error.response?.status || 500).json({
          message: 'Um erro inesperado ocorreu. Tente novamente mais tarde.',
        });
      }
    });
}
