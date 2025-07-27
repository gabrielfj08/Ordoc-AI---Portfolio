import * as React from 'react';
import { Typography } from 'printer-ui';
import Link from 'next/link';

const ContactInformation = () => {
  return (
    <div className="space-y-3 w-full px-4 sm:px-0 md:w-1/2">
      <Typography variant="title2" family="robotoBold">
        Informações do fabricante
      </Typography>
      <div className="flex space-x-2">
        <Typography variant="footnote1" family="robotoBold">
          Empresa:
        </Typography>
        <Typography variant="footnote1" family="robotoBold">
          PRINTER DO BRASIL TECNOLOGIA DA INFORMAÇÃO LTDA
        </Typography>
      </div>
      <div className="flex space-x-2">
        <Typography variant="footnote1" family="robotoBold">
          CNPJ:
        </Typography>
        <Typography variant="footnote1">04.916.444/0001-22</Typography>
      </div>
      <div className="flex space-x-2 items-center">
        <Typography variant="footnote1" family="robotoBold">
          Site:
        </Typography>
        <Typography variant="footnote1" color="info" className="underline">
          <Link href="https://printerdobrasil.com.br" legacyBehavior passHref>
            <a target="_blank">www.printerdobrasil.com.br</a>
          </Link>
        </Typography>
      </div>
      <div className="flex space-x-2">
        <Typography variant="footnote1" family="robotoBold">
          Email:
        </Typography>
        <Typography variant="footnote1">
          contato@printerdobrasil.com.br
        </Typography>
      </div>
      <div className="flex space-x-2">
        <Typography variant="footnote1" family="robotoBold">
          Telefone:
        </Typography>
        <Typography variant="footnote1">(41)3387-8613</Typography>
      </div>
      <div className="flex space-x-2">
        <Typography variant="footnote1" family="robotoBold">
          Whatsapp:
        </Typography>
        <Typography variant="footnote1">(41)98400-0929</Typography>
      </div>
    </div>
  );
};

export default ContactInformation;
