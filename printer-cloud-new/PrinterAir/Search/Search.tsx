import * as React from 'react';
import { rowSelectedItem, SearchProps } from './types';
import DocumentsTable from '../Search/Documents/Table';
import Accordion from '../../components/Accordion';
import SearchSelectedItemsMenuButton from './SelectedItemsMenuButton';

const Search = ({ queryString }: SearchProps) => {
  const [_selectedDocuments, setSelectedDocuments] = React.useState<
    rowSelectedItem[]
  >([]);

  return (
    <div>
      <div className="w-full px-4 pt-4">
        {_selectedDocuments.length ? (
          <SearchSelectedItemsMenuButton
            selectedDocumentIds={_selectedDocuments}
          />
        ) : null}
      </div>
      <div className="sm:pr-10 sm:px-3 sm:py-8 p-4">
        <Accordion
          defaultOpen
          items={[
            {
              label: 'Arquivos',
              content: (
                <DocumentsTable
                  queryString={queryString}
                  setSelectedDocuments={setSelectedDocuments}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Search;
