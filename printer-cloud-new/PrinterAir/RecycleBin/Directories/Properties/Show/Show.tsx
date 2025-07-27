import * as React from 'react';
import { Typography, Icon } from 'printer-ui';
import { ShowDirectoryPropertiesProps } from './types';

const ShowDirectoryProperties = ({
  directory,
}: ShowDirectoryPropertiesProps) => {
  const boxClassName =
    'w-full h-fit bg-lighterGray py-5 px-3.5 rounded-lg border border-lightGray flex space-x-2.5 items-center shadow-default';

  return (
    <>
      <div className={`${boxClassName}`}>
        <Icon name="folderOutlined" alt="folder" stroke w={26} h={26} />
        <div className="space-y-2.5 overflow-y-auto h-36 w-full">
          <div className="space-y-2">
            <Typography variant="footnote1" family="robotoMedium">
              Nome:
            </Typography>
            <Typography variant="footnote1">
              {directory.name.substring(0, directory.name.length - 9)}
            </Typography>
          </div>
          <div className="space-y-2">
            <Typography variant="footnote1" family="robotoMedium">
              Descrição:
            </Typography>
            <Typography variant="footnote1">{directory.description}</Typography>
          </div>
        </div>
      </div>

      <div className={boxClassName}>
        <Icon name="user" alt="user" stroke w={26} h={26} />
        <div className="space-y-2">
          <Typography variant="footnote1" family="robotoMedium">
            Criado por:
          </Typography>
          <Typography variant="footnote1">
            {directory.createdBy.name}
          </Typography>
          <Typography variant="footnote1" family="robotoMedium">
            Data de criação:
          </Typography>
          <Typography variant="footnote1">
            {new Intl.DateTimeFormat('pt-BR', {
              dateStyle: 'short',
              timeStyle: 'medium',
            }).format(new Date(directory.createdAt))}
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
            {directory.updatedBy.name}
          </Typography>
          <Typography variant="footnote1" family="robotoMedium">
            Data de exclusão:
          </Typography>
          <Typography variant="footnote1">
            {new Intl.DateTimeFormat('pt-BR', {
              dateStyle: 'short',
              timeStyle: 'medium',
            }).format(new Date(directory.updatedAt))}
          </Typography>
        </div>
      </div>
    </>
  );
};

export default ShowDirectoryProperties;
