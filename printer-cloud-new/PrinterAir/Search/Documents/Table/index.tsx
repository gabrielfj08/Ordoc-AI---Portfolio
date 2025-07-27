import * as React from 'react';
import router from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { Item, Typography } from 'printer-ui';
import { useAuth } from '../../../../hooks';
import { DocumentService } from '../../../../services/printer-air';
import { SearchDocumentsTableContainerProps } from './types';
import Pagination from '../../../../components/Pagination/Pagination';
import SearchSortSelect, { sortMapping, sortOptions } from '../../Select';
import SearchDocumentsTableEmpty from './Empty';
import DocumentsSkeleton from './Skeleton';
import DocumentsTableError from './Error';
import DocumentsTable from './Table';

const SearchDocumentsTableContainer = ({
  queryString,
  setSelectedDocuments,
}: SearchDocumentsTableContainerProps) => {
  const { subdomain, token } = useAuth();

  const [page, setPage] = React.useState(
    Number(new URLSearchParams(queryString).get('start')) / 10 + 1
  );

  const [sortSelection, setSortSelection] = React.useState(sortOptions[0]);

  React.useEffect(() => {
    setPage(Number(new URLSearchParams(queryString).get('start')) / 10 + 1);
  }, [queryString]);

  const { isLoading, isError, data } = useQuery({
    queryKey: ['documents', { queryString, token }],
    queryFn: () =>
      DocumentService.search(token, subdomain, decodeURIComponent(queryString)),
  });

  if (isError) {
    return <DocumentsTableError />;
  }

  if (isLoading) {
    return <DocumentsSkeleton />;
  }

  const totalDocs = data.meta.total;
  const docsPerPage = 10;

  if (data.meta.total === 0) return <SearchDocumentsTableEmpty />;

  const handlePageChange = (page: number) => {
    const searchParams = new URLSearchParams(queryString);

    searchParams.set('start', String(page * 10 - 10));

    router.push(`/printer-air/search?${searchParams.toString()}`);
  };

  const handleSortChange = (item: Item) => {
    const searchParams = new URLSearchParams(
      router.query as Record<string, string>
    );

    searchParams.set(
      'sort',
      decodeURIComponent(String(sortMapping[item.id].sort))
    );

    router.push(
      `/printer-air/search?${decodeURIComponent(searchParams.toString())}`
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center my-4">
        <span className="flex items-center sm:space-x-2.5">
          <Typography
            variant="footnote1"
            color="gray"
            className="hidden sm:block"
          >
            Ordenar pastas por
          </Typography>
          <div className="hidden sm:block">
            <SearchSortSelect
              size="md"
              w={52}
              sortSelection={sortSelection}
              setSortSelection={(item: Item) => {
                setSortSelection(item);
                handleSortChange(item);
              }}
            />
          </div>
          <div className="sm:hidden">
            <SearchSortSelect
              size="md"
              w={44}
              sortSelection={sortSelection}
              setSortSelection={(item: Item) => {
                setSortSelection(item);
                handleSortChange(item);
              }}
            />
          </div>
        </span>
        <Pagination
          page={page}
          setPage={handlePageChange}
          totalPages={Math.ceil(totalDocs / docsPerPage)}
          totalObjects={totalDocs}
          objectsPerPage={docsPerPage}
        />
      </div>
      <DocumentsTable
        data={data.documents}
        setSelectedDocuments={setSelectedDocuments}
      />
    </div>
  );
};

export default SearchDocumentsTableContainer;
