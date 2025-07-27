import type { NextApiRequest, NextApiResponse } from 'next';
import cep from 'cep-promise';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return cep(req.body.cep)
    .then((result) => res.json(result))
    .catch((error) => res.status(422).json(error));
}
