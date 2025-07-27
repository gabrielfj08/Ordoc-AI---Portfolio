import * as React from 'react';
import { Typography, Icon } from 'printer-ui';
import { useDrawer } from '../../../../hooks';
import { DocumentPropertiesProps } from './types';
import CopyPRN from '../../../components/CopyPRN';

const DocumentProperties = ({ document }: DocumentPropertiesProps) => {
  const { closeDrawer } = useDrawer();

  return (
    <main className="h-full max-w-full p-4 sm:p-8 overflow-y-auto">
      <div className="flex items-end justify-end px-6">
        <button
          onClick={() => {
            closeDrawer();
          }}
        >
          <Icon name="close" alt="close" stroke w={35} h={35} />
        </button>
      </div>
      <header className="flex justify-center items-center pb-8 p-6">
        <Icon name="info" alt="info" stroke w={26} h={26} />
        <Typography variant="headline" family="robotoMedium" className="pl-2">
          Propriedades do arquivo
        </Typography>
      </header>
      <div className="space-y-3">
        <div className="rounded-lg w-full sm:max-h-52 sm:h-44 h-36 flex justify-between justify-left items-center bg-lighterGray border border-lightGray shadow-default pl-2">
          <Icon name="pdfFileV2" alt="pdfFileV2" fill w={26} h={26} />
          <div className="grid justify-left items-center overflow-y-auto h-full p-3 sm:w-full w-full">
            <Typography variant="footnote1" family="robotoMedium">
              Nome:
            </Typography>
            <Typography variant="footnote1" className="pb-2">
              {document.originalFilename}
            </Typography>
            <Typography variant="footnote1" family="robotoMedium">
              Descrição:
            </Typography>
            <Typography variant="footnote1" className="pb-2">
              {document.description}
            </Typography>
            <Typography variant="footnote1" family="robotoMedium">
              Localização:
            </Typography>
            <Typography variant="footnote1" className="pb-2">
              {document.location}
            </Typography>
          </div>
        </div>

        <div className="rounded-lg w-full sm:max-h-32 sm:h-20 h-16 items-center flex bg-lighterGray border border-lightGray shadow-default pl-2">
          <Icon name="user" alt="user" stroke w={26} h={26} />
          <div className="grid justify-left items-center overflow-auto w-full h-full pl-3 mr-2 -space-y-8">
            <Typography
              variant="footnote1"
              family="robotoMedium"
              className="pb-2"
            >
              Criado por:
            </Typography>
            <Typography variant="footnote1">
              {document.createdBy.name}
            </Typography>
          </div>
        </div>

        <div className="rounded-lg w-full sm:max-h-32 sm:h-20 h-16 items-center flex bg-lighterGray border border-lightGray shadow-default pl-2">
          <Icon name="clock" alt="clock" stroke w={28} h={28} />
          <div className="grid justify-left items-center overflow-auto w-full h-full pl-3 mr-2 -space-y-6">
            <Typography
              variant="footnote1"
              family="robotoMedium"
              className="pb-2"
            >
              Data de envio:
            </Typography>
            <Typography variant="footnote1" className="pb-2">
              {new Date(Date.parse(document.createdAt)).toLocaleDateString(
                'pt-br'
              )}
              {' às '}
              {new Date(Date.parse(document.createdAt)).toLocaleTimeString(
                'pt-br'
              )}
            </Typography>
          </div>
        </div>

        <div className="rounded-lg w-full sm:max-h-32 sm:h-20 h-16 items-center flex bg-lighterGray border border-lightGray shadow-default pl-2">
          <Icon name="storage" alt="storage" fill w={26} h={26} />
          <div className="grid justify-left items-center overflow-auto w-full h-full pl-3 mr-2 -space-y-8">
            <Typography
              variant="footnote1"
              family="robotoMedium"
              className="pb-2"
            >
              Tamanho:
            </Typography>
            <Typography variant="footnote1"> {document.size}</Typography>
          </div>
        </div>
      </div>
      <div className="rounded-lg w-full sm:max-h-32 sm:h-28 h-24 items-center flex space-y-1 flex-col bg-lighterGray border border-lightGray shadow-default sm:pt-4 pt-2 pl-2 mt-4">
        <CopyPRN prn={document.prn} />
      </div>
    </main>
  );
};

export default DocumentProperties;
