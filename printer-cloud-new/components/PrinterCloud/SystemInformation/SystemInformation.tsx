import * as React from 'react';
import { Typography } from 'printer-ui';
import { SystemInformationProps } from './types';

const SystemInformation = ({ about }: SystemInformationProps) => {
  return (
    <div className="space-y-3 w-full md:w-1/2 px-4 sm:px-0">
      <Typography variant="title2" family="robotoBold">
        Informações do sistema
      </Typography>
      <div className="flex space-x-2">
        <Typography variant="footnote1" family="robotoBold">
          Sistema:
        </Typography>
        <Typography variant="footnote1">{about.name}</Typography>
      </div>
      <div className="flex space-x-2">
        <Typography variant="footnote1" family="robotoBold">
          Data de lançamento:
        </Typography>
        <Typography variant="footnote1">12/02/2021</Typography>
      </div>
      <div className="flex space-x-2">
        <Typography variant="footnote1" family="robotoBold">
          Data de atualização:
        </Typography>
        <Typography variant="footnote1">
          {new Date(Date.parse(about.releasedAt)).toLocaleDateString('pt-br')}
        </Typography>
      </div>
      <div className="flex space-x-2">
        <Typography variant="footnote1" family="robotoBold">
          Versão:
        </Typography>
        <Typography variant="footnote1">{about.version}</Typography>
      </div>
    </div>
  );
};

export default SystemInformation;
