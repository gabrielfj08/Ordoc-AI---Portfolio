import * as React from 'react';
import router from 'next/router';
import { Button, Icon, Input, Item, Typography } from 'printer-ui';
import { RequesterProps } from './types';
import RequestersSortSelect, {
  sortMapping,
  sortOptions,
} from '../components/Requesters/Select';
import Pagination from '../../components/Pagination/Pagination';
import RequestersTable from '../components/Requesters/Table';
import FlowFilterButtonContainer from '../components/FilterButton';
import RequesterFilter from './Filter/Filter';

const Requester = ({ setParams, params }: RequesterProps) => {
  const [sortSelection, setSortSelection] = React.useState(sortOptions[0]);
  const [totalObjects, setTotalObjects] = React.useState(0);

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  return (
    <div className="w-full mb-12">
      <div className="sm:flex sm:space-x-2.5 space-y-4 sm:space-y-0 my-6 px-3">
        <Button
          label="Solicitante externo"
          color="info"
          className="hidden sm:flex"
          onClick={() => openInNewTab('/flow-cidadao/new-requester')}
        >
          <Button.Icon
            alt="plus"
            name="plus"
            color="white"
            stroke
            w={24}
            h={24}
          />
        </Button>
        <div className="w-full sm:w-5/12 hidden sm:block">
          <Input
            type="search"
            float
            name="q"
            size="md"
            value={params.q}
            w="full"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setParams({ ...params, q: e.target.value, page: 1 });
            }}
          >
            <Icon alt="search" name="search" color="gray" stroke />
          </Input>
        </div>
        <div className="w-full sm:hidden block">
          <Input
            type="search"
            name="q"
            float
            w="full"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.preventDefault();
              setParams({ ...params, q: e.target.value, page: 1 });
            }}
            value={params.q}
            size="sm"
          >
            <Icon
              alt="search"
              name="search"
              color="gray"
              stroke
              w={24}
              h={24}
            />
          </Input>
        </div>
        <div className="flex justify-between">
          <Button
            label="Solicitante externo"
            color="info"
            className="sm:hidden"
            size="sm"
            onClick={() => openInNewTab('/flow-cidadao/new-requester')}
          >
            <Button.Icon
              alt="plus"
              name="plus"
              color="white"
              stroke
              w={20}
              h={20}
            />
          </Button>
          <FlowFilterButtonContainer
            params={params}
            setParams={setParams}
            filterType="requester"
          >
            <RequesterFilter />
          </FlowFilterButtonContainer>
        </div>
      </div>
      <div className="flex justify-between items-center my-4 sm:mr-10 px-3">
        <span className="flex items-center sm:space-x-2.5">
          <Typography
            variant="footnote1"
            color="gray"
            className="hidden sm:block"
          >
            Ordenar por
          </Typography>
          <div className="hidden sm:block">
            <RequestersSortSelect
              size="md"
              w="52"
              sortSelection={sortSelection}
              setSortSelection={(item: Item) => {
                setSortSelection(item);
                setParams({ ...params, ...sortMapping[item.id], page: 1 });
              }}
            />
          </div>
          <div className="sm:hidden">
            <RequestersSortSelect
              size="sm"
              w="44"
              sortSelection={sortSelection}
              setSortSelection={(item: Item) => {
                setSortSelection(item);
                setParams({ ...params, ...sortMapping[item.id], page: 1 });
              }}
            />
          </div>
        </span>
        <Pagination
          page={params.page}
          setPage={(page) => setParams({ ...params, page: page })}
          totalPages={Math.ceil(totalObjects / params.perPage)}
          totalObjects={totalObjects}
          objectsPerPage={params.perPage}
        />
      </div>
      <div className="px-2 sm:px-0 sm:mr-10">
        <RequestersTable params={params} setTotalObjects={setTotalObjects} />
      </div>
    </div>
  );
};

export default Requester;
