import client from '../../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';

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

  const transformData = (data) => {
    return {
      address: {
        city: data.address.city,
        complement: data.address.complement,
        createdAt: data.address.created_at,
        deletedAt: data.address.deleted_at,
        id: data.address.id,
        neighborhood: data.address.neighborhood,
        number: data.address.number,
        postalCode: data.address.postal_code,
        state: data.address.state,
        street: data.address.street,
        updatedAt: data.address.updated_at,
      },
      apps: data.apps.map((app) => {
        return {
          createdAt: app.created_at,
          description: app.description,
          id: app.id,
          name: app.name,
          prn: app.prn,
          service: app.service,
          updatedAt: app.updated_at,
        };
      }),
      cnpj: data.cnpj,
      contactName: data.contact_name,
      contactPhone: data.contact_phone,
      corporateName: data.corporate_name,
      createdAt: data.created_at,
      deletedAt: data.deleted_at,
      email: data.email,
      id: data.id,
      logoUrl: data.logo_url,
      phone: data.phone,
      prn: data.prn,
      rootDirectory: {
        id: data.root_directory.id,
      },
      site: data.site,
      status: data.status,
      storageLimit: data.storage_limit,
      updatedAt: data.updated_at,
      usersCount: data.users_count,
    };
  };

  return client
    .put(
      `/v3/printer_cloud/organizations/${req.query.organizationId}/add_user?email=${req.query.email}`,
      {},
      config
    )
    .then((response) => {
      res.status(response.status).json(transformData(response.data));
    })
    .catch((error) => {
      res.status(error.response.status).json(error.response.data);
    });
}
