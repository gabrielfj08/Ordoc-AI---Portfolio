import * as React from 'react';
import { Typography, Icon } from 'printer-ui';
import { ItemsListProps } from './types';

const ItemsList = ({
  selectedDocuments,
  selectedDirectories,
}: ItemsListProps) => {
  return (
    <div>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {selectedDirectories.length > 0 && (
          <Typography variant="footnote1" family="robotoMedium">
            {selectedDirectories.length > 1 ? 'Pastas' : 'Pasta'}:
          </Typography>
        )}
        {selectedDirectories.map((directory) => (
          <div
            className="bg-lighterGray rounded-lg p-4 flex space-x-2 items-center"
            key={directory.id}
          >
            <Icon alt="folder" name="folderOutlined" stroke w={26} h={26} />
            <Typography variant="footnote1">
              {directory.name.substring(0, directory.name.length - 9)}
            </Typography>
          </div>
        ))}
        {selectedDocuments.length > 0 && (
          <Typography variant="footnote1" family="robotoMedium">
            {selectedDocuments.length > 1 ? 'Arquivos' : 'Arquivo'}:
          </Typography>
        )}
        {selectedDocuments.map((document) => (
          <div
            className="bg-lighterGray rounded-lg p-4 flex space-x-2 items-center"
            key={document.id}
          >
            <Icon alt="file" name="fileV2" fill w={28} h={28} />
            <Typography variant="footnote1">
              {document.name.substring(0, document.name.length - 9)}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsList;
