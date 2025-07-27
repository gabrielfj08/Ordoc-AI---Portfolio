import client from '../../../client';
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

  return client
    .post(
      '/v3/printer_cloud/organizations',
      {
        organization: {
          cnpj: req.body.cnpj,
          corporate_name: req.body.corporate_name,
          email: req.body.email,
          phone: req.body.phone,
          contact_name: req.body.contact_name,
          contact_phone: req.body.contact_phone,
          site: req.body.site,
          // logo: req.body.logo,
        },
        address: {
          street: req.body.street,
          number: req.body.number,
          complement: req.body.complement,
          postal_code: req.body.postal_code,
          city: req.body.city,
          state: req.body.state,
          neighborhood: req.body.neighborhood,
        },
      },
      config
    )

    .then((response) => {
      res.status(response.status).json(response.data);
    })
    .catch((error) => {
      res.status(error.response.status).json(error.response.data);
    });
}
