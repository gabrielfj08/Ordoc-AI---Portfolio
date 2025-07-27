import * as React from 'react';
import { Typography, Icon } from 'printer-ui';
import { ShowDirectoryPropertiesProps } from './types';
import CopyPRN from '../../../../components/CopyPRN';

const ShowDirectoryProperties = ({
  directory,
}: ShowDirectoryPropertiesProps) => {
  return (
    <main className="h-full max-w-full p-4 sm:p-6 space-y-3 overflow-y-auto">
      <div className="rounded-lg w-full sm:max-h-52 sm:h-44 h-36 flex justify-between justify-left items-center bg-lighterGray border border-lightGray shadow-default pl-2">
        <Icon name="folderOutlined" alt="folderOutlined" stroke w={26} h={26} />
        <div className="grid justify-left items-center overflow-y-auto h-full p-3 sm:w-full w-full">
          <Typography variant="footnote1" family="robotoMedium">
            Nome:
          </Typography>
          <Typography variant="footnote1" className="pb-2">
            {directory.name}
          </Typography>
          <Typography variant="footnote1" family="robotoMedium">
            Descrição:
          </Typography>
          <Typography variant="footnote1" className="pb-2">
            {directory.description}
          </Typography>
        </div>
      </div>

      <div className="rounded-lg w-full sm:max-h-40 sm:h-28 h-24 flex items-center bg-lighterGray border border-lightGray shadow-default pl-2 pt-2">
        <Icon name="user" alt="user" stroke w={26} h={26} />
        <div className="grid justify-left items-center overflow-auto w-full h-full pl-3">
          <Typography variant="footnote1" family="robotoMedium">
            Criado por:
          </Typography>
          <Typography variant="footnote1" className="pb-2">
            {directory.createdBy.name}
          </Typography>
          <Typography variant="footnote1" family="robotoMedium">
            Data de criação:
          </Typography>
          <Typography variant="footnote1" className="pb-2">
            {new Date(Date.parse(directory.createdAt)).toLocaleDateString(
              'pt-br'
            )}{' '}
            às{' '}
            {new Date(Date.parse(directory.createdAt)).toLocaleTimeString(
              'pt-br'
            )}
          </Typography>
        </div>
      </div>

      <div className="rounded-lg w-full sm:max-h-40 sm:h-28 h-24 flex items-center bg-lighterGray border border-lightGray shadow-default pl-2 pt-2">
        <Icon name="versionsV2" alt="versionsV2" fill w={26} h={26} />
        <div className="grid justify-left items-center overflow-auto w-full h-full pl-3">
          <Typography variant="footnote1" family="robotoMedium">
            Atualizado por:
          </Typography>
          <Typography variant="footnote1" className="pb-2">
            {directory.updatedBy.name}
          </Typography>
          <Typography variant="footnote1" family="robotoMedium">
            Data de atualização:
          </Typography>
          <Typography variant="footnote1" className="pb-2">
            {new Date(Date.parse(directory.createdAt)).toLocaleDateString(
              'pt-br'
            )}{' '}
            às{' '}
            {new Date(Date.parse(directory.createdAt)).toLocaleTimeString(
              'pt-br'
            )}
          </Typography>
        </div>
      </div>
      <div className="rounded-lg w-full sm:max-h-40 sm:h-28 h-24 flex flex-col items-center bg-lighterGray border border-lightGray shadow-default pt-2">
        <CopyPRN prn={directory.prn} />
      </div>
    </main>
  );
};

export default ShowDirectoryProperties;
