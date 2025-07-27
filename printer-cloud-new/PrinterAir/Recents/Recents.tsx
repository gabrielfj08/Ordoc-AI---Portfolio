import * as React from 'react';
import { RecentsProps } from './types';
import RecentsTable from './Table';
import Accordion from '../../components/Accordion';
import SelectedItemsMenuButtonRecent from './SelectedItemsMenuButton';
import router from 'next/router';
import RecentDocumentError from './Table/Error';

const Recents = ({ organizationId }: RecentsProps) => {
  const [selectedDocumentIds, setSelectedDocumentIds] = React.useState<
    Array<number>
  >([]);

  if (!router.query.organizationId) {
    return <RecentDocumentError />;
  }

  return (
    <div>
      <div
        className={`w-full px-4 pt-4 ${
          selectedDocumentIds.length ? 'block' : 'hidden'
        }`}
      >
        <SelectedItemsMenuButtonRecent
          selectedDocumentIds={selectedDocumentIds}
        />
      </div>
      <div className="sm:pr-10 sm:px-3 sm:py-8 p-4">
        <Accordion
          defaultOpen
          items={[
            {
              label: 'Arquivos',
              content: (
                <RecentsTable
                  organizationId={organizationId}
                  setSelectedDocumentIds={setSelectedDocumentIds}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Recents;
