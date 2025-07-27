import * as React from 'react';
import { rowSelectedItem, RecycleBinProps } from './types';
import DirectoriesTable from '../RecycleBin/Directories/Table';
import DocumentsTable from '../RecycleBin/Documents/Table';
import Accordion from '../../components/Accordion';
import SelectedItemsMenuButton from './SelectedItemsMenuButton';

const RecycleBin = ({}: RecycleBinProps) => {
  const [selectedDirectories, setSelectedDirectories] = React.useState<
    rowSelectedItem[]
  >([]);
  const [selectedDocuments, setSelectedDocuments] = React.useState<
    rowSelectedItem[]
  >([]);

  const items = selectedDocuments.concat(selectedDirectories);

  return (
    <div>
      <div className={`w-full px-4 pt-4 ${items.length ? 'block' : 'hidden'}`}>
        <SelectedItemsMenuButton
          selectedDirectories={selectedDirectories}
          selectedDocuments={selectedDocuments}
        />
      </div>
      <div className="sm:pr-10 sm:px-3 sm:py-8 p-4">
        <Accordion
          defaultOpen
          items={[
            {
              label: 'Pastas',
              content: (
                <DirectoriesTable
                  setSelectedDirectories={setSelectedDirectories}
                />
              ),
            },
            {
              label: 'Arquivos',
              content: (
                <DocumentsTable setSelectedDocuments={setSelectedDocuments} />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default RecycleBin;
