import * as React from 'react';
import { Typography, Icon } from 'printer-ui';
import { useDrawer } from '../../../../hooks';
import { DocumentPropertiesProps } from './types';

const DocumentProperties = ({ document }: DocumentPropertiesProps) => {
  const { closeDrawer } = useDrawer();
  const boxClassName =
    'w-full h-fit bg-lighterGray py-5 px-3.5 rounded-lg border border-lightGray flex space-x-2.5 items-center shadow-default';

  return (
    <div className="w-screen max-w-full h-screen px-4 sm:px-14 flex flex-col py-8 space-y-4 overflow-auto">
      <div className="flex justify-end">
        <button
          onClick={() => {
            closeDrawer();
          }}
        >
          <Icon name="close" alt="close" stroke w={35} h={35} />
        </button>
      </div>
      <div className="flex items-center justify-center space-x-2 py-4">
        <Icon alt="info" name="info" stroke w={26} h={26} />
        <Typography family="robotoMedium" variant="headline">
          Propriedades do arquivo
        </Typography>
      </div>
      <div className={`${boxClassName}`}>
        <Icon name="pdfFileV2" alt="pdfFileV2" fill w={26} h={26} />
        <div className="space-y-2.5 overflow-y-auto h-36 w-full">
          <div className="space-y-2">
            <Typography variant="footnote1" family="robotoMedium">
              Nome:
            </Typography>
            <Typography variant="footnote1">
              {document.originalFilename}
            </Typography>
          </div>
          <div className="space-y-2">
            <Typography variant="footnote1" family="robotoMedium">
              Descrição:
            </Typography>
            <Typography variant="footnote1" className="min-h-[8px]">
              {document.description}
            </Typography>
          </div>
          <div className="space-y-2">
            <Typography variant="footnote1" family="robotoMedium">
              Localização:
            </Typography>
            <Typography variant="footnote1">
              <span className="text-red">{document.location}</span>
            </Typography>
          </div>
        </div>
      </div>

      <div className={boxClassName}>
        <Icon name="user" alt="user" stroke w={26} h={26} />
        <div className="space-y-2">
          <Typography variant="footnote1" family="robotoMedium">
            Criado por:
          </Typography>
          <Typography variant="footnote1">{document.createdBy.name}</Typography>
          <Typography variant="footnote1" family="robotoMedium">
            Data de criação:
          </Typography>
          <Typography variant="footnote1">
            {new Intl.DateTimeFormat('pt-BR', {
              dateStyle: 'short',
              timeStyle: 'medium',
            }).format(new Date(document.createdAt))}
          </Typography>
        </div>
      </div>

      <div className={boxClassName}>
        <Icon name="trashV2" alt="trashV2" fill w={26} h={26} />
        <div className="space-y-2">
          <Typography variant="footnote1" family="robotoMedium">
            Excluído por:
          </Typography>
          <Typography variant="footnote1">
            {document.updatedBy?.name}
          </Typography>
          <Typography variant="footnote1" family="robotoMedium">
            Data de exclusão:
          </Typography>
          <Typography variant="footnote1">
            {new Intl.DateTimeFormat('pt-BR', {
              dateStyle: 'short',
              timeStyle: 'medium',
            }).format(new Date(document.updatedAt))}
          </Typography>
        </div>
      </div>

      <div className={boxClassName}>
        <Icon name="storage" alt="storage" fill w={26} h={26} />
        <div className="space-y-2">
          <Typography variant="footnote1" family="robotoMedium">
            Tamanho:
          </Typography>
          <Typography variant="footnote1">{document.size}</Typography>
        </div>
      </div>
    </div>
  );
};

export default DocumentProperties;
