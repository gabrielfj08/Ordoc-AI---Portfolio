import * as React from 'react';
import Accordion from '../../components/Accordion';
import { SharedProps } from './types';
import SharedDirectoriesTable from './Directories/Table';
import SharedDocumentsTable from './Documents/Table';

const Shared = ({ organizationId, root, parentSharedId }: SharedProps) => {
  return (
    <div className="sm:pr-10 sm:px-3 sm:py-8 p-4">
      <Accordion
        defaultOpen
        items={[
          {
            label: 'Pastas',
            content: (
              <SharedDirectoriesTable
                organizationId={organizationId}
                root={root}
                parentSharedId={parentSharedId}
              />
            ),
          },
          {
            label: 'Arquivos',
            content: (
              <SharedDocumentsTable
                organizationId={organizationId}
                root={root}
                parentSharedId={parentSharedId}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default Shared;
