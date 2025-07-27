import client from '../../../../../../client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { camelToSnake } from '../../../../../../utils';
import { GenerateExternalOtpAPIResponse } from '../../../../../../services/flow-cidadao/types';

const transformGenerateExtOtpData = (data): GenerateExternalOtpAPIResponse => {
  return { message: data.message };
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

  switch (req.method) {
    case 'POST':
      return client
        .post(
          `/v3/printer_flow/external/requesters/passwords`,
          {
            cpf_cnpj: req.body.cpfCnpj.replace(/[^0-9]/g, ''),
            notification: req.body.notification,
          },
          config
        )
        .then((response) => {
          res
            .status(response.status)
            .json(transformGenerateExtOtpData(response.data));
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
          `/v3/printer_flow/external/requesters/passwords`,
          camelToSnake(req.body),
          config
        )
        .then((response) => {
          res.status(response.status).json(response.data);
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
