import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../client';
import { OrganizationAPIResponse } from '../../services/types';
import { snakeToCamel } from '../../utils';

const transformData = (data): OrganizationAPIResponse => {
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
    subdomain: data.subdomain,
    storageLimit: data.storage_limit,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    rootDirectory: {
      id: data.root_directory.id,
      name: data.root_directory.name,
      description: data.root_directory.description,
      organizationId: data.root_directory.organization_id,
      prn: data.root_directory.prn,
      parentDirectoryId: data.root_directory.parent_directory_id,
      previousParentPrn: data.root_directory.previous_parent_prn,
      createdAt: data.root_directory.created_at,
      updatedAt: data.root_directory.updated_at,
    },
    recycleBinDirectory: {
      id: data.recycle_bin_directory.id,
      name: data.recycle_bin_directory.name,
      description: data.recycle_bin_directory.description,
      organizationId: data.recycle_bin_directory.organization_id,
      prn: data.recycle_bin_directory.prn,
      parentDirectoryId: data.recycle_bin_directory.parent_directory_id,
      previousParentPrn: data.recycle_bin_directory.previous_parent_prn,
      createdAt: data.recycle_bin_directory.created_at,
      updatedAt: data.recycle_bin_directory.updated_at,
    },
    theme: data.theme
      ? {
          id: data.theme.id,
          organizationId: data.theme.organization_id,
          imageUrl: data.theme.image_url,
          backgroundUrl: data.theme.background_url,
          color: snakeToCamel(data.theme.color),
          createdAt: data.theme.created_at,
          updatedAt: data.theme.updated_at,
        }
      : null,
    address: data.address
      ? {
          id: data.address.id,
          street: data.address.street,
          number: data.address.number,
          complement: data.address.complement,
          city: data.address.city,
          state: data.address.state,
          postalCode: data.address.postal_code,
          neighborhood: data.address.neighborhood,
          createdAt: data.address.created_at,
          updatedAt: data.address.updated_at,
        }
      : null,
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const config = {
    headers: {
      'X-Api-Subdomain': req.headers['x-api-subdomain'] as string,
      'X-Forwarded-For': req.headers['x-forwarded-for']
        ? (req.headers['x-forwarded-for'] as string).split(',')[0]
        : req.headers['x-real-ip']
        ? (req.headers['x-real-ip'] as string)
        : (req.socket.remoteAddress as string),
    },
  };

  return client
    .get(`/organization`, config)
    .then((response) => {
      res.status(response.status).json(transformData(response.data));
    })
    .catch((error) => {
      res.status(error.response.status).json(error.response.data);
    });
}
